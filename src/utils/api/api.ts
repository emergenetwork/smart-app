import { typesBundleForPolkadot } from '@darwinia/types/mix';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type ExtType from '@polkadot/extension-inject/types';
import { message } from 'antd';
import BN from 'bn.js';
import { TFunction } from 'i18next';
import Web3 from 'web3';
import { DVM_KTON_WITHDRAW_ADDRESS, NetworkIds, TOKEN_ERC20_KTON } from '../../config';
import { AccountType, IAccountMeta, NetworkConfig, NetworkType } from '../../model';
import ktonABI from './abi/ktonABI.json';

export interface Connection {
  accounts: ExtType.InjectedAccountWithMeta[];
  api: ApiPromise | null;
  networkStatus: ConnectStatus;
}

export type ConnectStatus = 'pending' | 'connecting' | 'success' | 'fail';

export type TokenBalance = [string, string];

const RPC_CONFIG: NetworkConfig<string> = {
  crab: 'wss://crab.darwinia.network',
  darwinia: 'wss://rpc.darwinia.network',
  pangolin: 'wss://pangolin-rpc.darwinia.network/',
};

// const darwiniaApi: ApiPromise | null = null;

export async function connectNodeProvider(type: NetworkType = 'darwinia'): Promise<ApiPromise> {
  const provider = new WsProvider(RPC_CONFIG[type]);
  const darwiniaApi = await ApiPromise.create({
    provider,
    typesBundle: {
      spec: {
        /* tslint:disable */
        Crab: typesBundleForPolkadot.spec.crab as any,
        Pangolin: typesBundleForPolkadot.spec.pangolin as any,
        Darwinia: typesBundleForPolkadot.spec.darwinia as any,
        /* tslint:enable */
      },
    },
  });

  await darwiniaApi.isReady;

  return darwiniaApi;
}

export async function connectSubstrate(
  network: NetworkType,
  enable = 'polkadot-js/apps'
): Promise<{
  accounts: ExtType.InjectedAccountWithMeta[];
  extensions: ExtType.InjectedExtension[];
  api: ApiPromise;
}> {
  try {
    const extensions = await web3Enable(enable); // TODO: ?
    const accounts = await web3Accounts();
    const api = await connectNodeProvider(network);

    return { accounts, extensions, api };
  } catch (err) {}
}

export function isMetamaskInstalled(): boolean {
  return typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined';
}

export async function isNetworkConsistent(network: NetworkType): Promise<boolean> {
  // id 1: eth mainnet 3: ropsten 4: rinkeby 5: goerli 42: kovan  43: pangolin
  const actualId = await window.ethereum.request({ method: 'net_version' });

  return NetworkIds[network] === actualId;
}

export async function connectEth(network: NetworkType): Promise<{ accounts: IAccountMeta[] }> {
  if (!isMetamaskInstalled) {
    return;
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });

  const accounts: string[] = await window.ethereum.request({ method: 'eth_accounts' });

  return {
    accounts: accounts.map((address) => ({ address })),
  };
}

export async function getTokenBalanceDarwinia(
  api: ApiPromise,
  account = ''
): Promise<TokenBalance> {
  try {
    await api?.isReady;
    // type = 0 query ring balance.  type = 1 query kton balance.
    /* tslint:disable */
    const ringUsableBalance = await (api?.rpc as any).balances.usableBalance(0, account);
    const ktonUsableBalance = await (api?.rpc as any).balances.usableBalance(1, account);
    /* tslint:enable */

    return [ringUsableBalance.usableBalance.toString(), ktonUsableBalance.usableBalance.toString()];
  } catch (error) {
    return ['0', '0'];
  }
}

export function connectFactory(
  successFn: (accounts: IAccountMeta[]) => void,
  t: TFunction,
  indicator?: (status: ConnectStatus) => void
): (network: NetworkType, accountType: AccountType) => Promise<void> {
  return async (network: NetworkType, accountType: AccountType) => {
    const connect = accountType === 'substrate' ? connectSubstrate : connectEth;

    indicator('connecting');

    connect(network)
      .then(({ accounts }) => {
        successFn(accounts);
        indicator('success');
      })
      .catch((error) => {
        message.error(t('Unable to connect to {{type}} network.', { type: network }));
      });
  };
}

export async function getTokenBalanceEth(account = ''): Promise<TokenBalance> {
  const web3 = new Web3(window.ethereum);
  let ring = '0';
  let kton = '0';

  try {
    ring = await web3.eth.getBalance(account);
  } catch (error) {
    console.error(
      '%c [ get ring balance in ethereum error ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      error.message
    );
  }

  try {
    // tslint:disable-next-line: no-any
    const ktonContract = new web3.eth.Contract(ktonABI as any, TOKEN_ERC20_KTON, { gas: 55000 });

    kton = await ktonContract.methods.balanceOf(account).call();
  } catch (error) {
    console.error(
      '%c [ get kton balance in ethereum error ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      error.message
    );
  }

  return [ring, kton];
}

/**
 * @param account receive account - metamask current active account;
 * @param amount receive amount
 * @returns transaction hash
 */
export async function receiveKton(account: string, amount: BN): Promise<string> {
  // ?FIXE: use code below after contract updated.
  // const web3 = new Web3(window.ethereum || window.web3.currentProvider);
  // const ktonContract = new web3.eth.Contract(x16ABI as any, TOKEN_ERC20_KTON);
  // const txHash = await ktonContract.methods
  //   .transfer_and_call(
  //     TOKEN_ERC20_KTON,
  //     web3.utils.toWei(amount)
  //   )
  //   .send({ from: account });

  const web3 = new Web3(window.ethereum || window.web3.currentProvider);
  const balance = amount.toString();
  const result = web3.eth.abi.encodeParameters(['address', 'uint256'], [TOKEN_ERC20_KTON, balance]);
  const startPosition = 2;
  const data = '0x3225da29' + result.substr(startPosition);
  const txHash = await web3.eth.sendTransaction({
    from: account,
    to: DVM_KTON_WITHDRAW_ADDRESS,
    data,
    value: '0x00',
    gas: 30000000,
  });

  return txHash.transactionHash;
}