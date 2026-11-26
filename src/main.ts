import './style.css'
import { GardenApp } from './ui/app.ts'

const root = document.querySelector<HTMLElement>('#app')

if (root) {
  new GardenApp(root)
}
