import React from 'react'
import { GoogleAuthProvider, getAuth , signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import { signInSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const GoogleHandler = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: result.user.displayName , email: result.user.email , photo: result.user.photoURL})
            })

            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate("/")
            
        } catch (error) {
            console.log("Could not sign in with google", error)
        }
    }



  return (
      <button onClick={GoogleHandler} type="button"
          className='bg-rose-700 text-white 
          p-3 rounded-lg uppercase
          hover:opacity-95' >
              Continue with Goggle
        </button>
    
  )
}
