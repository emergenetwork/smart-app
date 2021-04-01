import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Network } from '../config/config';
import { useAccount } from '../hooks';
import { AccountType, NetworkType } from '../model';
import { toOppositeAccountType } from '../utils';
import { SwapCrabIcon, SwapMainIcon, SwapPangolinIcon } from './icons';
import { SwitchWalletModal } from './modal/SwitchWallet';

export interface TransferValue {
  from?: string;
  to?: string;
}

export interface TransferSelectProps {
  // tslint:disable-next-line: no-any
  value?: any;
  onChange?: () => void;
}

interface AccountProps {
  accountType: AccountType;
  title: string;
}

const networks: NetworkType[] = [Network.main, Network.crab, Network.pangolin];

function AccountGrid({ accountType, title }: AccountProps) {
  const [account, setAccount] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const { switchNetwork, network } = useAccount();
  const { t } = useTranslation();
  const whirl = 'animate-whirl';
  const whirlReverse = 'animate-whirl-reverse';

  useEffect(() => {
    const textRef = panelRef.current?.querySelector('.bg-main');

    panelRef.current?.classList.remove(whirl);
    textRef?.classList.remove(whirlReverse);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        panelRef.current?.classList.add(whirl);
        textRef?.classList.add(whirlReverse);
      });
    });

    const listener = () => setAccount(accountType);

    panelRef.current?.addEventListener('animationend', listener);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => panelRef.current?.removeEventListener('animationend', listener);
  }, [accountType]);

  return (
    <div>
      <p className='mb-2'>{title}</p>
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu
            onClick={({ key }) => {
              switchNetwork(key as NetworkType);
            }}
          >
            {networks.map((item) => (
              <Menu.Item
                key={item}
                className={(item === network ? 'bg-gray-100' : '') + ' flex justify-between'}
              >
                <span className='capitalize'>{t(item)}</span>
                {accountType === 'smart' && (
                  <span className='bg-main rounded-xl text-xs text-white px-2 py-0.5'>
                    {t('smart')}
                  </span>
                )}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <div
          ref={panelRef}
          className={
            'border border-gray-200 border-solid flex items-center justify-between text-lg p-1 rounded-xl bg-gray-100 cursor-pointer'
          }
        >
          <div
            className='bg-main rounded-xl flex flex-col items-center'
            style={{ width: 120, height: 100 }}
          >
            <img src='/image/darwinia.7ff17f8e.svg' style={{ height: 60 }} alt='' />
            <span className='dream-btn capitalize'>{account}</span>
          </div>

          <DownOutlined className='mx-2' />
        </div>
      </Dropdown>
    </div>
  );
}

const ICON_CONFIG = {
  main: { icon: SwapMainIcon },
  crab: { icon: SwapCrabIcon },
  pangolin: { icon: SwapPangolinIcon },
  darwinia: { icon: SwapMainIcon },
};

export function TransferSelect({ value, onChange }: TransferSelectProps) {
  const { t } = useTranslation();
  const { from, switchFrom, network } = useAccount();
  const [isWalletSwitcherVisible, setIsWalletSwitcherVisible] = useState(false);

  return (
    <>
      <div className='grid grid-cols-3 items-stretch'>
        <AccountGrid accountType={from} title={t('From')} />

        <div className='flex items-center justify-center self-stretch'>
          {React.createElement(ICON_CONFIG[network].icon, {
            onClick: () => {
              setIsWalletSwitcherVisible(true);
            },
            className:
              'cursor-pointer text-4xl mt-6 transform origin-center transition-all duration-300',
            style: { transform: `rotateY(${from === 'main' ? '0' : '180deg'})` },
          })}
        </div>

        <AccountGrid accountType={toOppositeAccountType(from)} title={t('To')} />
      </div>

      <SwitchWalletModal
        cancel={() => setIsWalletSwitcherVisible(false)}
        confirm={() => {
          switchFrom(toOppositeAccountType(from));
        }}
        isVisible={isWalletSwitcherVisible}
      />
    </>
  );
}
