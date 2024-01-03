import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "created_at",
        order: "desc"
    })
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    console.log(listings)

    // getting the search existed data 
    useEffect(() => {
        // Matching the previous of search to the new ones from the sidebar
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get("searchTerm")
        const typeFromUrl = urlParams.get("type")
        const offerFromUrl = urlParams.get("offer")
        const parkingFromUrl = urlParams.get("parking")
        const furnishedFromUrl = urlParams.get("furnished")
        const sortFromUrl = urlParams.get("sort")
        const orderFromUrl = urlParams.get("order")

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            offerFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            sortFromUrl ||
            orderFromUrl 
        ) {
            setSidebarData({
               searchTerm: searchTermFromUrl || "",
                type: typeFromUrl || "all",
                offer :offerFromUrl === "true" ? true : false,
                parking: parkingFromUrl === "true" ? true : false,
                furnished: furnishedFromUrl === "true" ? true : false,
                sort: sortFromUrl || "created_at",
                order: orderFromUrl || "desc",

            })
        }

        // fetch the listing according to the query 
        const fetchListings = async () => {
            try {
                setLoading(true)
                const searchQuery = urlParams.toString()
                const res = await fetch(`/api/listing/get?${searchQuery}`)
                const data = await res.json()
                if (data.success === false) {
                    console.log(data.message)
                    setLoading(false)
                }
                setListings(data)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
            
        }
        fetchListings()
    },[location.search])

    const handleChange = (e) => {
        if (e.target.id === "all" || e.target.id === "sale" || e.target.id === "rent") {
            setSidebarData({
                ...sidebarData, type: e.target.id
            })
        }

        if (e.target.id === "searchTerm") {
            setSidebarData({
                ...sidebarData, searchTerm: e.target.value
            })
        }

        if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            setSidebarData({
                ...sidebarData, [e.target.id]:
                    e.target.checked || e.target.checked === "true" ? true : false    
            })
        }

        if (e.target.id === "sort_order") {
            const sort = e.target.value.split("_")[0] || "created_at"
            const order = e.target.value.split("_")[1] || "desc"
            setSidebarData({
                ...sidebarData, sort , order 
            })
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set("searchTerm", sidebarData.searchTerm)
        urlParams.set("type", sidebarData.type)
        urlParams.set('parking', sidebarData.parking)
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('offer', sidebarData.offer)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }




  return (
      <div className='flex flex-col md:flex-row'>
          {/*left side*/}
          <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
              <form
                  onSubmit={submitHandler}
                  className='flex flex-col gap-8'
              >
                  <div className='flex items-center gap-2'>
                      <label className='whitespace-nowrap font-semibold' >Search Term:</label>
                      <input
                          type="text"
                          id="searchTerm"
                          placeholder='Search...'
                          className='border rounded-lg p-3 w-full'
                          value={sidebarData.searchTerm}
                          onChange={handleChange}
                      />
                  </div>
                  {/* Type */}
                  <div className='flex gap-2 flex-wrap items-center'>
                      <label className='font-semibold'>Type:</label>
                      <div className='flex gap-2 '>
                          <input
                              className='w-5'
                              type="checkbox"
                              id="all"
                              onChange={handleChange}
                              checked={sidebarData.type === "all"}
                          />
                          <span>Rent & Sale</span>
                      </div>

                      <div className='flex gap-2 '>
                          <input
                              className='w-5'
                              type="checkbox"
                              id="rent"
                              onChange={handleChange}
                              checked={sidebarData.type === "rent"}
                          />
                          <span>Rent</span>
                      </div>

                      <div className='flex gap-2 '>
                          <input
                              className='w-5'
                              type="checkbox"
                              id="sale"
                              onChange={handleChange}
                              checked={sidebarData.type === "sale"}
                          />
                          <span>Sale</span>
                      </div>

                      <div className='flex gap-2 '>
                          <input
                              className='w-5'
                              type="checkbox"
                              id="offer"
                              onChange={handleChange}
                              checked={sidebarData.offer}
                          />
                          <span>Offer</span>
                      </div>
                      
                  </div>
                  {/* Amenities */}
                  <div className='flex gap-2 flex-wrap items-center'>
                      <label className='font-semibold'>Amenities:</label>
                      <div className='flex gap-2 '>
                          <input
                              className='w-5'
                              type="checkbox"
                              id="parking"
                              onChange={handleChange}
                              checked={sidebarData.parking}
                          />
                          <span>Parking</span>
                      </div>

                      <div className='flex gap-2 '>
                          <input
                              className='w-5'
                              type="checkbox"
                              id="furnished"
                              onChange={handleChange}
                              checked={sidebarData.furnished}
                          />
                          <span>Furnished</span>
                      </div>
                  </div>
                  {/* sort and selector */}
                  <div className='flex items-center gap-2'>
                      <label className='font-semibold' >Sort:</label>
                      <select
                          id="sort_order"
                          className='border rounded-lg p-3'
                          onChange={handleChange}
                          defaultValue={"created_at_desc"}
                      >
                          <option value="regularPrice_desc">Price High to Low</option>
                          <option value="regularPrice_asc" >Price Low to High</option>
                          <option value="createdAt_desc">Latest</option>
                          <option value="createdAt_asc">Oldest</option>
                      </select>
                  </div>
                  <button
                      type="submit"
                      className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
                  >Search</button>
                  
               </form>
          </div>

          {/* Right side */}
          <div className=''>
              <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results: </h1>
          </div>
          
    </div>
  )
}
