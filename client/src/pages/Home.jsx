import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
import SwiperCore from "swiper"
import { Navigation } from 'swiper/modules'
import ListingItem from '../components/ListingItem'

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Navigation])


  useEffect(() => {
    const fetchOfferListings = async () => {
        try {
          const res = await fetch(`/api/listing/get?offer=true&limit=3`)
          const data = await res.json()
          setOfferListings(data)
          fetchRentListings()
        } catch (error) {
          console.log(error)
        }
    }

    const fetchRentListings = async () => {
      try {
        
        const res = await fetch('/api/listing/get?type=rent&limit=4')
        const data = await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4')
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListings()
  },[])





  return (
    // three section in total
    <div className=''>
      {/* Top section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className='text-slate-500'>Perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          FindMyHouse is the best place for you to find your next nice place 
          to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >Let's get started...</Link>

      </div>

      {/* Swiper  */}

      <Swiper navigation>
        {
          offerListings &&
          offerListings.length > 0 &&
          offerListings.map((offerListing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${offerListing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover"
                }}
                key={offerListing._id}
                className="h-[500px]"></div>
              
            </SwiperSlide>
          ))}
      </Swiper>
      

      {/* Bottom: listings including the sale and rent and offer*/}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {/* offer listings */}
        {
          offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                <Link
                  className='text-sm text-blue-800 hover:underline'
                  to={'/search?offer=true'}
                >Show more offers</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing}/>
                  ))
                }
              </div>
            </div>
          )
        }

        {/* Rent listing */}
        {
          rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Places For Rent</h2>
                <Link
                  className='text-sm text-blue-800 hover:underline'
                  to={'/search?type=rent'}
                >Show more Rent</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  rentListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }

        {/* Sale listing */}
        {
          saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Places For Sale</h2>
                <Link
                  className='text-sm text-blue-800 hover:underline'
                  to={'/search?type=sale'}
                >Show more Sale</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  saleListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>

    </div>
  )
}
