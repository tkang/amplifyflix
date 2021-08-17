function UserActions({ userActions = [] }) {
  return (
    <div className="bg-white">
      <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          User Actions
        </h2>

        <div className="grid grid-cols-1 mt-6 gap-y-10 gap-x-6 sm:grid-cols-1 lg:grid-cols-1 xl:gap-x-8">
          <ul role="list" className="divide-y divide-gray-200">
            {userActions.map((activityItem) => (
              <li key={activityItem.id} className="py-4">
                <div className="flex space-x-3">
                  <img
                    className="w-6 h-6 rounded-full"
                    src={activityItem.person.imageUrl}
                    alt=""
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        {activityItem.person.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {activityItem.time}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Deployed {activityItem.project} ({activityItem.commit} in
                      master) to {activityItem.environment}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserActions;
