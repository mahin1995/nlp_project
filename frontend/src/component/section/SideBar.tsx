function SideBar() {
  return (
    <>
      <div className="xl:col-span-3 lg:col-span-4 lg:block  py-6">
        <div className="border-b-2 border-yellow-700 border-opacity-10 space-x-5 mb-8">
          <button className="text-xs font-bold pb-5 font-sans border-b-2 border-red-500">
            LATEST
          </button>
          <button className="text-xs font-bold pb-5 font-sans border-b-2 border-transparent text-gray-600 text-opacity-40">
            POPULAR
          </button>
          <button className="text-xs font-bold pb-5 font-sans border-b-2 border-transparent text-gray-600 text-opacity-40">
            HOT TOPIC
          </button>
        </div>
        <div className="flex flex-col space-y-8">
          <div className="flex">
            <img
              src="https://images.unsplash.com/photo-1587459450937-8402ffa769cd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
              alt="img"
              className="w-20 h-20 flex-shrink-0 mr-4 object-cover"
            />
            <div className="flex-grow flex flex-col">
              <a href="#" className="mb-0.5 hover:underline">
                Meditation hell of lyft, vinyl man
              </a>
              <p className="text-gray-600 text-opacity-40 text-xs mt-auto font-sans">
                5 minutes ago{" "}
                <a
                  href="#"
                  className="text-blue-400 lg:ml-2 lg:inline block hover:underline"
                >
                  Business
                </a>
              </p>
            </div>
          </div>
          <div className="flex">
            <img
              src="https://images.unsplash.com/photo-1478860002487-680cc42afbeb?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80"
              alt="img"
              className="w-20 h-20 flex-shrink-0 mr-4 object-cover"
            />
            <div className="flex-grow flex flex-col">
              <a href="#" className="mb-0.5 hover:underline">
                Hot chicken cray VHS scenester viral poke
              </a>
              <p className="text-gray-600 text-opacity-40 text-xs mt-auto font-sans">
                5 minutes ago{" "}
                <a
                  href="#"
                  className="text-blue-400 lg:ml-2 lg:inline block hover:underline"
                >
                  World
                </a>
              </p>
            </div>
          </div>
          <div className="flex">
            <img
              src="https://images.unsplash.com/photo-1549633030-89d0743bad01?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
              alt="img"
              className="w-20 h-20 flex-shrink-0 mr-4 object-cover"
            />
            <div className="flex-grow flex flex-col">
              <a href="#" className="mb-0.5 hover:underline">
                Retro pork belly vexillologist austin
              </a>
              <p className="text-gray-600 text-opacity-40 text-xs mt-auto font-sans">
                5 minutes ago{" "}
                <a
                  href="#"
                  className="text-blue-400 lg:ml-2 lg:inline block hover:underline"
                >
                  Health
                </a>
              </p>
            </div>
          </div>
          <div className="flex">
            <img
              src="https://images.unsplash.com/photo-1594103077729-ee3404f19caa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
              alt="img"
              className="w-20 h-20 flex-shrink-0 mr-4 object-cover"
            />
            <div className="flex-grow flex flex-col">
              <a href="#" className="mb-0.5 hover:underline">
                Pop-up next level ramps austin swag{" "}
              </a>
              <p className="text-gray-600 text-opacity-40 text-xs mt-auto font-sans">
                5 minutes ago{" "}
                <a
                  href="#"
                  className="text-blue-400 lg:ml-2 lg:inline block hover:underline"
                >
                  Health
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
