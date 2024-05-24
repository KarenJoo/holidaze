import { useState, useEffect } from 'react'

const useStorage = () => {
  const [userData, setUserData] = useState(null)
  const [isVenueManager, setIsVenueManager] = useState(false)

  const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const load = (key) => {
    const value = localStorage.getItem(key)
    return JSON.parse(value)
  }

  const remove = (key) => {
    localStorage.removeItem(key)
  }

  const clear = () => {
    localStorage.clear()
  }

  const clearUserData = () => {
    remove('userData')
    setUserData(null)
    setIsVenueManager(false)
  }

  const saveUserData = (userData) => {
    if (userData) {
      save('userData', userData)
      setUserData(userData);
    }
  }

  // stores isVenueManager value, name, from register form
  const loadUserData = () => {
    const loadedUserData = load('userData');
    setUserData(loadedUserData);
    return loadedUserData;
  }
  const saveVenueManager = (venueManager) => {
    save('venueManager', venueManager)
  }

  const isUserLoggedIn = () => {
    return userData !== null
  }

  const getUserRole = () => {
    const user = load('userData');
    return user?.isVenueManager ? 'isVenueManager' : 'customer';
  };

  const saveToken = (accessToken) => {
    localStorage.setItem('accessToken', accessToken)
  }

  const loadToken = () => {
    return localStorage.getItem('accessToken')
  }

  const saveApiKey = (apiKey) => {
    localStorage.setItem('apiKey', apiKey)
  }

  const loadApiKey = () => {
    return localStorage.getItem('apiKey')
  }

  useEffect(() => {
    const storedUserData = loadUserData();
    if (storedUserData) {
      setUserData(storedUserData);
    }
  }, []);

  return {
    saveUserData,
    saveApiKey,
    loadApiKey,
    loadUserData,
    isUserLoggedIn,
    saveToken,
    loadToken,
    getUserRole,
    clearUserData,
    remove,
    clear,
    save,
    load,
    saveVenueManager,
  }
}

export default useStorage
