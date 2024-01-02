import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {app} from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useDispatch } from 'react-redux'
import {updateUserStart, updateUserSuccess,updateUserFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signInStart, signInSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess} from "../redux/user/userSlice.js"
import { Link } from 'react-router-dom'

export default function Profile() {
  const { currentUser, loading, error } = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])
  

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

  // GET the listing of the user
  const showListingsHandler = async () => {
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()

      if (data.success === false) {
        setShowListingsError(true)
        return
      }

      setUserListings(data)
      
    } catch (error) {
      setShowListingsError(true)
      
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

        <Link
          to={"/create-listing"}
          className='bg-green-700 text-white 
          p-3 rounded-lg uppercase text-center hover:opacity-95'>
          Create Listing
        </Link>
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
      <p className='text-green-700 mt-5'>{updateSuccess ? "Successfully updated" : ""}</p>
      <button
        className='text-green-700 w-full'
        type='button'
        onClick={showListingsHandler}
      >Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError && "Error showing listings"}</p>
      <p className='text-red-700 mt-5'>{showListingsError ? "Error showing listings" : ""}</p>
      

      {userListings && userListings.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {
            userListings.map(listing =>
              <div
                key={listing._id}
                className='border rounded-lg p-3 flex justify-between items-center gap-4'>

                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className='h-16 w-16 object-contain'
                  />
                </Link>

                <Link
                  className='text-slate-700 font-semibold hover:underline truncate flex-1'
                  to={`/listing/${listing._id}`}>
                  <p>{listing.name}</p>
                </Link>

                <div className='flex flex-col items-center'>
                  <button className='text-red-700 uppercase'>Delete</button>
                  <button className='text-green-700 uppercase'>Edit</button>
                </div>



              </div>
            )
          }

        </div>
        }

    </div>
  )
}
