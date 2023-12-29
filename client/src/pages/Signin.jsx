import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { signInStart , signInSuccess , signInFailure } from '../redux/user/userSlice'
import { data } from 'autoprefixer'


export default function Signin() {

  const [formData, setFormData] = useState({})
  // const [error, setError] = useState(null)
  // const [loading, setLoading] = useState(false)
  const { loading, error } = useSelector((state)=> state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    try {

      // setLoading(true) instead we use below
      dispatch(signInStart())

      const res = await fetch("/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })

      const data = await res.json()
      // console.log(data)
      if (data.success === false) {
        // setLoading(false)
        // setError(data.message)
        dispatch(signInFailure(data.message))
        return
      }

      // setLoading(false)
      // setError(null)
      dispatch(signInSuccess(data))
      navigate("/")


    } catch (error) {
      // setLoading(false)
      // setError(error.message)
      dispatch(signInFailure(error.message))

    }

  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign in</h1>

      <form className='flex flex-col gap-4' onSubmit={submitHandler}>
        <input type="text" placeholder='email'
          className='border p-3 rounded-lg'
          id='email' onChange={changeHandler} />
        <input type="password" placeholder='password'
          className='border p-3 rounded-lg'
          id='password' onChange={changeHandler} />

        <button disabled={loading} className='bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >{loading ? "Loading..." : "Sign in"}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}

    </div>
  )
}
