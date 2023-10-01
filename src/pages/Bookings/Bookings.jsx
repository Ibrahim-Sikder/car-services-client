import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import BookingRow from "./BookingRow";
import Swal from "sweetalert2";


const Bookings = () => {
    const [bookings, setBookings] = useState()
    console.log(bookings)
    const { user } = useContext(AuthContext);
    const url = `http://localhost:5000/book?email=${user.email}`
    useEffect(()=>{
        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            setBookings(data)
        })
    },[url])


    const handleDelete = id =>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to delete this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/book/${id}`, {
                    method: "DELETE"
                })
                .then(res=>res.json())
                .then(data=>{
                    if(data.deletedCount){
                        Swal.fire(
                            'Deleted!',
                            'Your order has been deleted.',
                            'success'
                          )
                    }
                    const remaining = bookings.filter(book=>book._id !== id )
                    setBookings(remaining)
                })


             
            }
          })
        

    }
    const handleBookingConfirm = id =>{
        fetch(`http://localhost:5000/book/${id}`,{
            method: "PATCH",
            headers:{
                'content-type': 'application/json'
            },
            body: JSON.stringify({status: 'confirm'})
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.modifiedCount){
           const remaining = bookings.filter(book=>book._id !== id )
           const updated = bookings.find(book=>book._id === id);
           updated.status = 'confirm'
           const newBooking = [updated, ...remaining];
           setBookings(newBooking)
            }
        })
    }
  

    return (
        <div>
            <h2 className="text-5xl">Your bookings: {bookings?.length}</h2>
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Image</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookings?.map(booking => <BookingRow
                                key={booking._id}
                                booking={booking}
                                handleDelete={handleDelete}
                                handleBookingConfirm={handleBookingConfirm}
                            ></BookingRow>)
                        }
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default Bookings;