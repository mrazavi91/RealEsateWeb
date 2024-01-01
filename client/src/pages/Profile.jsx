import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {app} from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useDispatch } from 'react-redux'
import {updateUserStart, updateUserSuccess,updateUserFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signInStart, signInSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess} from "../redux/user/userSlice.js"

export default function Profile() {
  const { currentUser, loading, error } = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess , setUpdateSuccess] = useState(false)
  

  // Firebase storage 
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])


  // uploading the profile pic 
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
    
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log("Uploaded is " + progress + " % done")
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => setFormData({ ...formData, avatar: downloadURL })
        )
      })
     
  }


  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  } 
  
  // update profile (post request)
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      dispatch(updateUserStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      } 
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

      
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
    
  }


  // delete request
  const deleteUserHandler = async () => {

    try {
      dispatch(deleteUserStart())

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      })
      
      const data = await res.json()

      dispatch(deleteUserSuccess(data))

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
    
  }


  // Sign out 
  const signoutUserHandler = async () => {

    try {
      dispatch(signOutUserStart())

      const res = await fetch("/api/auth/signout")
      const data = res.json()
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return;
      }

      dispatch(signOutUserSuccess(data))

    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
    
  }



  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={submitHandler} className='flex flex-col gap-4'>

        <input
          type="file"
          ref={fileRef} onChange={(e) => setFile(e.target.files[0])}
          hidden accept='image/*'
        />

        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile" onClick={() => fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover 
          cursor-pointer self-center mt-2' />
        
        <p className='text-sm self-center'>
          {fileUploadError ? 
          <span className='text-red-700'>Uploading Error</span>
          :
          filePerc > 0 && filePerc < 100 ?
            <span className='text-slate-700'></span>
            :
            filePerc === 100 ? <span className='text-green-700'>Image
              successfully uploaded</span>
              :
              ""
              

          }</p>
        
        
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg'
          id='username'
          onChange={changeHandler}
        />
        
        <input
          type='email'
          placeholder='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          id="email"
          onChange={changeHandler}
        />
        
        <input
          type='password'
          placeholder='password' 
          className='border p-3 rounded-lg'
          id='password'
          onChange={changeHandler}
        />
        
        <button
          disabled={loading}
          className='bg-slate-700
         text-white rounded-lg 
          p-3 uppercase hover:opacity-95
          disabled:opacity-80'>
          {loading ? "Loading..." : "Update"}
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        
        <span
          onClick={deleteUserHandler}
          className='text-red-700 cursor-pointer'
        >Delete Account</span>

        <span
          onClick={signoutUserHandler}
          className='text-red-700 cursor-pointer'
        >Sign out</span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "Successfully updated" : "" }</p>


    </div>
  )
}
