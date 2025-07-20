import React from "react";

const CheckoutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      
      <div className="md:col-span-2 space-y-8">
    
        <div>
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First name"
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Last name"
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Enter delivery address"
            className="border px-3 py-2 rounded w-full mt-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <select className="border px-3 py-2 rounded w-full">
              <option>City</option>
              <option>Nairobi</option>
              <option>Mombasa</option>
            </select>
            <select className="border px-3 py-2 rounded w-full">
              <option>State</option>
              <option>Nairobi</option>
            </select>
            <input
              type="text"
              placeholder="Zip code"
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Enter your phone number"
            className="border px-3 py-2 rounded w-full mt-4"
          />
          <div className="flex items-center mt-2">
            <input type="checkbox" id="save" className="mr-2" />
            <label htmlFor="save">Save this information for next time</label>
          </div>
        </div>

       
        <div>
          <h2 className="text-xl font-bold mb-4">Shipping method</h2>
          <div className="space-y-2">
            <label className="flex items-center justify-between border px-3 py-2 rounded">
              <div className="flex items-center space-x-2">
                <input type="radio" name="shipping" defaultChecked />
                <span>Standard shipping (3-5 days)</span>
              </div>
              <span>KES 350</span>
            </label>
            <label className="flex items-center justify-between border px-3 py-2 rounded">
              <div className="flex items-center space-x-2">
                <input type="radio" name="shipping" />
                <span>Expedited shipping (1-2 days)</span>
              </div>
              <span>KES 700</span>
            </label>
          </div>
        </div>

  
        <div>
          <h2 className="text-xl font-bold mb-4">Payment</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" defaultChecked />
              <span>Mpesa</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" />
              <span>Card Payment</span>
            </label>
          </div>
        </div>

        <button className="bg-green-600 text-white w-full py-3 rounded mt-4">
          Pay now
        </button>
      </div>

    
      <div>
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Product Name {item}</h3>
                <p className="text-sm text-gray-500">Description here</p>
              </div>
              <p>KES 1,500</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>KES 3,000</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>KES 350</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>KES 3,350</span>
          </div>
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Discount code or gift card"
            className="border px-3 py-2 rounded w-full"
          />
          <button className="mt-2 w-full bg-gray-800 text-white py-2 rounded">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
