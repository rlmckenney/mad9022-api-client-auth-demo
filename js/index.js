import {getNewAuthToken, getCurrentUser} from './api.js'

const APP = {
  currentUser: null,
  /*
   * Example of using Getters and Setters to add special handling
   * of object property values. @see https://javascript.info/property-accessors
   *
   * Use a pseudo-private property `APP._jwt` to store the actual token value.
   * All references to the APP.authToken property will be filtered through
   * the `get` and `set` methods below. In this example, the value is
   * automatically stored to and retrieved from localStorage.
   *
   * NOTE: the getter and setter functions must be synchronous - no promises.
   */
  get authToken() {
    if (!this._jwt) {
      this._jwt = JSON.parse(localStorage.getItem('jwt')) || null
    }
    return this._jwt
  },
  set authToken(value) {
    this._jwt = value
    localStorage.setItem('jwt', JSON.stringify(value))
  }
}

// Get commonly used DOM elements only once
const greetingEl = document.getElementById('greeting')
const formEl = document.getElementById('login-form')

async function main() {
  registerEventHandlers()
  APP.currentUser = await getCurrentUser(APP.authToken)
  updateDisplay()
}

function registerEventHandlers() {
  formEl.addEventListener('submit', handleSubmit)
}

async function handleSubmit(e) {
  e.preventDefault()

  if (APP.authToken) {
    logoutUser()
  } else {
    await loginUser()
  }
  updateDisplay()
}

function logoutUser() {
  APP.authToken = null
  APP.currentUser = null
}

async function loginUser() {
  displaySpinner()
  const {email, password} = getUserCredentials()
  // The next two lines could return errors from the server.
  // The UI should be updated to show the response message.
  APP.authToken = await getNewAuthToken(email, password)
  APP.currentUser = await getCurrentUser(APP.authToken)
}

function getUserCredentials() {
  const email = formEl.email.value
  const password = formEl.password.value
  // normally you should clear the form after obtaining the values
  // I did not in order to save retyping in the demo
  // formEl.email.value = ''
  // formEl.password.value = ''
  return {email, password}
}

function displaySpinner() {
  // cog icon SVG courtesy of https://heroicons.com/
  const cogIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" class="icon animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>`

  const buttonEl = document.getElementById('auth-trigger')
  buttonEl.innerHTML = `${cogIcon} Processing ...`
}

function updateDisplay() {
  if (APP.currentUser) {
    greetingEl.textContent = `Hello ${APP.currentUser.firstName}!`
    formEl['auth-trigger'].textContent = 'Logout'
    formEl.email.disabled = true
    formEl.password.disabled = true
  } else {
    greetingEl.textContent = `Please login.`
    formEl['auth-trigger'].textContent = 'Login'
    formEl.email.disabled = false
    formEl.password.disabled = false
  }
}

document.addEventListener('DOMContentLoaded', main)
