import React, { useState } from 'react'
import { TextField, Button, MenuItem, Typography, Box } from '@mui/material'
import { registerUser, loginUser } from '../../utils/registerFetch'
import useStorage from '../../utils/useStorage'
import Alert from '@mui/material/Alert'
import CheckIcon from '@mui/icons-material/Check'
import { useDispatch } from 'react-redux'
import {
  login,
  setVenueManager,
  setUserData,
} from '../../storage/reducers/authReducer'

const BaseForm = ({ variant }) => {
  const isRegister = variant === 'register'
  const storage = useStorage()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState(() => {
    const userData = storage.loadUserData()
    return {
      createUsername: '',
      createPassword: '',
      email: '',
      avatarUrl: '',
      venueManager: userData ? userData.isVenueManager : false,
    }
  })

  const [errors, setErrors] = useState({})
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    const inputErrors = {}

    if (isRegister && !formData.createUsername) {
      inputErrors.createUsername = 'Create Username is required'
    }

    if (!formData.createPassword) {
      inputErrors.createPassword = 'Create Password is required'
    }

    if (!formData.email) {
      inputErrors.email = 'Email is required'
    }

    setErrors(inputErrors)
    return Object.keys(inputErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        const { email, createPassword } = formData

        let loggedInUser

        // register user
        if (isRegister) {
          const { createUsername, email, createPassword, avatarUrl } = formData

          const registerData = {
            name: createUsername,
            email,
            password: createPassword,
            avatar: {
              url: avatarUrl,
            },
            venueManager: formData.venueManager,
          }

          const registeredUser = await registerUser(registerData)
          console.log('User registered successfully:', registeredUser)

          storage.saveUserData({
            ...registeredUser.data,
            isVenueManager: formData.venueManager,
          })

          setRegistrationSuccess(true)
          dispatch(login()); 

          // Log in user
          loggedInUser = registeredUser
        } else {
          loggedInUser = await loginUser({
            email,
            password: createPassword,
          })

          if (loggedInUser.data.accessToken) {
            const accessToken = loggedInUser.data.accessToken
            const isVenueManager = formData.venueManager

            storage.saveToken(accessToken)
            storage.saveUserData(loggedInUser.data)

            storage.saveUserData({
              ...loggedInUser.data,
              isVenueManager: isVenueManager,
            })

            console.log('Logged In User:', loggedInUser.data)
            console.log('Access Token:', accessToken)

            localStorage.setItem('userLoggedIn', 'true')

            window.location.href = '/profile'

            dispatch(login())
            dispatch(setVenueManager(isVenueManager))
            dispatch(setUserData(loggedInUser.data))
          } else {
            alert('Login failed. Please check your credentials.')
          }
        }
      } catch (error) {
        console.error('Registration/Login failed:', error.message)
        alert('Registration/Login failed. Please try again.')
      }
    }
  }

  const { createUsername, createPassword, email, avatarUrl } = formData
  const {
    email: emailError,
    createUsername: usernameError,
    createPassword: createPasswordError,
  } = errors



  return (
    <Box >
      <form
        onSubmit={handleSubmit} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '80%',
          padding: '20px',
          margin: '30px auto',
          color: '#000',
          borderRadius: '10px',
          backgroundColor: '#fff',
          marginBottom: '50px',
          textAlign: 'left',
        }}
      >
        <Typography variant='h1' style={{ color: 'primary' }}>
          {isRegister ? 'Register' : 'Log in'}
        </Typography>

        {isRegister && (
          <>
            <TextField
              name='createUsername'
              label='Create Username'
              variant='outlined'
              fullWidth
              value={createUsername}
              onChange={handleInputChange}
              error={!!usernameError}
              helperText={usernameError}
              style={{ backgroundColor: '#fff', color: '#000' }}
              InputLabelProps={{
                style: { color: '#000' },
              }}
            />

            <TextField
              name='createPassword'
              label='Create Password'
              type='password'
              variant='filled'
              fullWidth
              value={createPassword}
              onChange={handleInputChange}
              error={!!createPasswordError}
              helperText={createPasswordError}
              
            />

            <TextField
              name='email'
              label='Email'
              type='email'
              variant='filled'
              fullWidth
              value={email}
              onChange={handleInputChange}
              error={!!emailError}
              helperText={emailError}
             
            />

            <TextField
              name='avatarUrl'
              label='Avatar URL'
              variant='filled'
              fullWidth
              value={avatarUrl}
              onChange={handleInputChange}
             
            />

            <TextField
              name='venueManager'
              select
              label='User role'
              variant='filled'
              fullWidth
              value={formData.venueManager ? 'manager' : 'customer'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  venueManager: e.target.value === 'manager' ? true : false,
                })
              }
              error={!errors.venueManager}
              helperText={errors.venueManager}
             
            >
              <MenuItem value='customer'>Customer</MenuItem>
              <MenuItem value='manager'>Manager</MenuItem>
            </TextField>
          </>
        )}

        {!isRegister && (
          <>
            <TextField
              name='email'
              label='Email'
              type='email'
              variant='filled'
              fullWidth
              value={email}
              onChange={handleInputChange}
              error={!!emailError}
              helperText={emailError}
              
            />

            <TextField
              name='createPassword'
              label='Password'
              type='password'
              variant='filled'
              fullWidth
              value={createPassword}
              onChange={handleInputChange}
              error={!!createPasswordError}
              helperText={createPasswordError}
          
            />
          </>
        )}

        {registrationSuccess && (
          <Alert icon={<CheckIcon fontSize='inherit' />} severity='success'>
            User registered successfully!
          </Alert>
        )}
        <Button
          type='submit'
          variant='contained'
          color='secondary'
          style={{ marginTop: '20px' }}
        >
          {isRegister ? 'Register' : 'Login'}
        </Button>
        
      </form>
    </Box>
  )
}

export default BaseForm
