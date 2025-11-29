import { createContext, useContext, useState, useEffect } from 'react';

const AccountContext = createContext();

const MDR_ACCOUNT_KEY = 'crbntyp-mdr-account';

// Personal account (default)
const personalAccount = {
  name: 'Jonny Pyper',
  email: 'jpyper@rapid7.com',
  domain: null,
  isPersonal: true,
};

const mdrAccounts = [
  { name: 'Evri', domain: 'evri.com' },
  { name: 'Capital on Tap', domain: 'capitalontap.com' },
  { name: 'Deliveroo', domain: 'deliveroo.com' },
  { name: 'Monzo', domain: 'monzo.com' },
  { name: 'Revolut', domain: 'revolut.com' },
  { name: 'Just Eat', domain: 'just-eat.com' },
  { name: 'Trainline', domain: 'trainline.com' },
];

export function AccountProvider({ children }) {
  const [activeAccountIndex, setActiveAccountIndex] = useState(() => {
    const saved = localStorage.getItem(MDR_ACCOUNT_KEY);
    if (saved !== null) {
      const index = parseInt(saved, 10);
      if (!isNaN(index) && index >= 0 && index < mdrAccounts.length) {
        return index;
      }
    }
    return null; // Default to personal account
  });

  const currentAccount = activeAccountIndex === null
    ? personalAccount
    : mdrAccounts[activeAccountIndex];

  const setActiveAccount = (index) => {
    setActiveAccountIndex(index);
    if (index === null) {
      localStorage.removeItem(MDR_ACCOUNT_KEY);
    } else {
      localStorage.setItem(MDR_ACCOUNT_KEY, index.toString());
    }
  };

  return (
    <AccountContext.Provider value={{
      activeAccountIndex,
      setActiveAccount,
      currentAccount,
      personalAccount,
      mdrAccounts,
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}
