import { useEffect } from 'react'
import { StorageManager } from './lib/database'
import { useAppStore } from './store/appStore'
import './index.css'
import App from './App'

export function AppBootstrap() {
  useEffect(() => {
    // Initialize app on mount
    const initializeApp = async () => {
      // Request persistent storage on iOS
      await StorageManager.requestPersistentStorage()

      // Load all recall items and flight lists from IndexedDB
      const [items, lists] = await Promise.all([
        StorageManager.getAllRecallItems(),
        StorageManager.getAllFlightLists(),
      ])

      useAppStore.getState().setRecallItems(items)
      useAppStore.getState().setFlightLists(lists)

      // Set first flight list as active if available
      if (lists.length > 0) {
        useAppStore.getState().setActiveFlightList(lists[0].id || null)
      }
    }

    initializeApp().catch(err => console.error('Failed to initialize app:', err))
  }, [])

  return <App />
}

export default AppBootstrap
