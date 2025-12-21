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

const BASE_URL = import.meta.env.BASE_URL;

// Real Rapid7 customers from https://www.rapid7.com/customers/
const mdrAccounts = [
  { name: 'Evri', domain: 'evri.com', logo: `${BASE_URL}logos/evri.png` },
  { name: 'Arcadis', domain: 'arcadis.com', logo: `${BASE_URL}logos/arcadis.png` },
  { name: 'Zoopla', domain: 'zoopla.co.uk', logo: `${BASE_URL}logos/zoopla.png` },
  { name: 'Wyndham Hotels', domain: 'wyndhamhotels.com', logo: `${BASE_URL}logos/wyndham.png` },
  { name: 'Paddle', domain: 'paddle.com', logo: `${BASE_URL}logos/paddle.png` },
  { name: 'Keyloop', domain: 'keyloop.com', logo: `${BASE_URL}logos/keyloop.png` },
  { name: 'Visier', domain: 'visier.com', logo: `${BASE_URL}logos/visier.png` },
  { name: 'Capital on Tap', domain: 'capitalontap.com', logo: `${BASE_URL}logos/capitalontap.png` },
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
