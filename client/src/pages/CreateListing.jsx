import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useState } from 'react'
import { app } from '../firebase'

export default function CreateListing() {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading , setUploading] = useState(false)
    console.log(formData)

    const imageUploadHandler = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = []

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))   
            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUploading(false)
                
            }).catch((error) => {
                setImageUploadError("Image Upload Failed , Maximum 2 MB per Image")
                setUploading(false)
            })
        } else {
            setImageUploadError("Only Maximum 6 Images an be uploaded per Listing")
            setUploading(false)
        }
        
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                "state_changed", 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log("Uploaded is " + progress + " % done")
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
        
    }

    // delete image uploaded
    const imageRemoverHandler = (index) => {
        setFormData({
            ...formData , imageUrls: formData.imageUrls.filter((_ , i)=> i !== index)
        })
        
    }





  return (
      <main className='p-3 max-w-4xl mx-auto'>
          <h1
              className='text-3xl font-semibold
                        text-center my-7'>
              Create a Listing
          </h1>

          <form className='flex flex-col sm:flex-row gap-4'>
              {/* left side */}
              <div className='flex flex-col gap-4 flex-1'>
                  <input type="text" placeholder='Name'
                      className="border p-3 rounded-lg"
                      id='name' maxLength='62' minLength='10' required
                  />

                  <textarea type="text" placeholder='Description'
                      className="border p-3 rounded-lg"
                      id='description' required
                  />

                  <input type="text" placeholder='Address'
                      className="border p-3 rounded-lg"
                      id='address' required
                  />

                  <div className='flex gap-6 flex-wrap'>
                      <div className='flex gap-2'>
                          <input type="checkbox" className="w-5" id="sale" />
                          <span>Sell</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" className="w-5" id="rent" />
                          <span>Rent</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" className="w-5" id="parking" />
                          <span>Parking</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" className="w-5" id="furnished" />
                          <span>Furnished</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" className="w-5" id="offer" />
                          <span>Offer</span>
                      </div>
                  </div>

                  <div className='flex flex-wrap gap-6'>
                      
                      <div className='flex items-center gap-2'>
                          <input
                              className='p-3 border border-gray-300 rounded-lg'
                              type="number"
                              id='bedrooms'
                              min='1' max='10'
                              required
                          />
                          <p>Beds</p>
                      </div>

                      <div className='flex items-center gap-2'>
                          <input
                              className='p-3 border border-gray-300 rounded-lg'
                              type="number"
                              id='bathrooms'
                              min='1' max='10'
                              required
                          />
                          <p>Baths</p>
                      </div>

                      <div className='flex items-center gap-2'>
                          <input
                              className='p-3 border border-gray-300 rounded-lg'
                              type="number"
                              id='regularPrice'
                              min='1' max='10'
                              required
                          />
                          <div className='flex flex-col items-center'>
                              <p>Regular price</p>
                              <span className='text-xs'>($ / month)</span>
                          </div>
                          
                      </div>

                      <div className='flex items-center gap-2'>
                          <input
                              className='p-3 border border-gray-300 rounded-lg'
                              type="number"
                              id='discountPrice'
                              min='1' max='10'
                              required
                          />
                          <div className='flex flex-col items-center'>
                              <p>Discounted price</p>
                              <span className='text-xs'>($ / month)</span>
                          </div>
                      </div>

                  </div>
              </div>

              {/* right side */}
              <div className='flex flex-col flex-1 gap-4'>
                  <p className='font-semibold'>Images:
                      <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6 images)</span>
                  </p>
                  <div className='flex gap-3'>
                      <input
                          type="file"
                          name="images"
                          id="image/*" multiple
                          className='p-3 border border-gray-300 rounded w-full'
                          onChange={(e)=> setFiles(e.target.files)}
                      />
                      <button
                          className='p-3 text-green-700 border
                           border-green-700 
                           rounded uppercase
                           hover:shadow-lg disabled:opacity-80'
                          type="button"
                          onClick={imageUploadHandler}
                          disabled={uploading}
                      >{uploading ? "Uploading..." : "Upload"}</button>
                  </div>

                  {/* Error for image upload */}
                  <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                  {
                      formData.imageUrls.length > 0 && formData.imageUrls.map((url , index) => (
                          <div key={url} className='flex justify-between p-3 boarder items-center '>
                              <img
                                  src={url} alt='listing image'
                                  className='w-20 h-20 object-contain rounded-lg'
                              />
                              <button
                                  type='button'
                                  className='p-3 text-red-700 rounded-lg 
                                    uppercase hover:opacity-75'
                                  onClick={()=>imageRemoverHandler(index)}
                              >Delete</button>
                          </div>
                      ))
                  }

                  {/* Create Listing Button */}
                  <button
                      className='p-3 bg-slate-700 text-white 
                                rounded-lg uppercase hover:opacity-95 
                                disabled:opacity-80'
                  >Create Listing</button>
              </div>              
          </form>
    </main>
  )
}
