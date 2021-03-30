import { Button, Dropdown, Menu, Modal } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from '../providers/account';
import { AccountSelect } from './AccountSelect';
import { ShortAccount } from './ShortAccount';
import { WalletConnection } from './WalletConnection';

export function Connection() {
  const { t } = useTranslation();
  const [isSmartSwitcherVisible, setIsSmartSwitcherVisible] = useState(false);
  const [isAccountSwitcherVisible, setIsAccountSwitcherVisible] = useState(false);
  const { from, account, setAccount, switchFrom } = useAccount();

  return (
    <>
      {account ? (
        <section className='flex items-center gap-2'>
          <div className='flex items-center justify-between bg-main h-auto leading-normal gap-2 pl-4 rounded-xl'>
            <img
              src='/image/darwinia.7ff17f8e.svg'
              className='scale-150'
              style={{ height: 32 }}
              alt=''
            />
            <span className='text-purple-500 px-2 py-0.5 rounded-xl bg-white'>{t('Main')}</span>
            <ShortAccount
              account={account}
              className='self-stretch px-4 bg-white my-px mx-px rounded-xl'
            />
          </div>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => setIsAccountSwitcherVisible(true)}>
                  {t('switch_to_another_main_address')}
                </Menu.Item>
                <Menu.Item onClick={() => setIsSmartSwitcherVisible(true)}>
                  {t('switch_to_smart_address')}
                </Menu.Item>
                <Menu.Item onClick={() => setAccount('')}>{t('disconnect')}</Menu.Item>
              </Menu>
            }
          >
            <Button>{t('change_wallet')}</Button>
          </Dropdown>
        </section>
      ) : (
        <WalletConnection />
      )}

      <AccountSelect
        account={account}
        isVisible={isAccountSwitcherVisible}
        confirm={setAccount}
        cancel={() => setIsAccountSwitcherVisible(false)}
      />

      <Modal
        title={t('Switch Wallet')}
        visible={isSmartSwitcherVisible}
        onOk={() => {
          setIsSmartSwitcherVisible(false);
          switchFrom(from === 'main' ? 'smart' : 'main');
        }}
        onCancel={() => {
          setIsSmartSwitcherVisible(false);
        }}
        footer={[
          <button className='dream-btn w-1/2'>{t('Cancel')}</button>,
          <Button
            type='primary'
            onClick={() => {}}
            className='w-1/2 bg-main border-none rounded-xl'
          >
            {t('Confirm')}
          </Button>,
        ]}
        wrapClassName='large-footer-btn'
      >
        <p>
          {t(
            'Do you want to login with darwinia smart account? Current account will be disconnect after switch to darwinia smart account.'
          )}
        </p>
      </Modal>
    </>
  );
}
