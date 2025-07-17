import React from 'react'

const Contact = () => {
  return (
    <>
      <section
        id="contact"
        className="relative bg-white text-black py-15 px-6 overflow-hidden"
      >
        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-15 items-start">
          <h2 className="text-4xl font-bold mb-4">
            Let’s talk <span className="text-orange-500">with us!</span>
          </h2>
          <p className="block text-black mb-8">
            if you have any question, feel free to write.
          </p>
          <form className="space-y-6">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Kim Dan"
                required
                className="w-full px-4 py-3 rounded-md bg-[#c2c2c5] text-gray border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Kimdan@gmail.com"
                required
                className="w-full px-4 py-3 rounded-md bg-[#c2c2c5] text-gray border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone Number</label>
              <input
                type="string"
                name="phone number"
                placeholder="+25471234568"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#c2c2c5] text-gray border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">How can we help</label>
              <textarea
                rows={12}
                name="message"
                placeholder="message..."
                required
                className="w-full px-4 py-3 rounded-lg bg-[#c2c2c5] text-gray border border-gray-600"
              />
            </div>
            <button
            type="submit"
            // disabled={loading}
            className="bg-orange-600 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-900 transition"
            >
                Send Message →
            </button>
          </form>
          <div className="flex items-center gap-15 mb-2">
            <img className="h-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" 
            src="/images/contact_image.png" alt="image of people on telephone"/>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
