import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState("")
    // HH

    useEffect(() => {
        const fetchLandlord = async () => {
            try {


                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()
                setLandlord(data)
    
            } catch (error) {
               console.log(error)
            }
        }

        fetchLandlord()

    }, [listing.userRef])

    const onChange = (e) => {
        setMessage(e.target.value)
    }


  return (
      <>
          {landlord && (
              <div className='flex flex-col gap-3'>
                  <p>Contact <span className='font-semibold'
                  >{landlord.username}</span> for <span className='font-semibold'
                  >{listing.name.toLowerCase()}</span>
                  </p>
                  <textarea
                      placeholder='Enter your message'
                      className='w-full boarder p-3 rounded-lg'
                      name="message"
                      id="message"
                      rows="2"
                      value={message}
                      onChange={onChange}
                  ></textarea>
                  <Link
                      to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                      className='bg-slate-700 text-white text-center
                                p-3 uppercase rounded-lg hover:opacity-95'   
                  >
                      Send Message
                  </Link>
              </div>
          )}
      </>
  )
}
