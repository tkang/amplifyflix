function ReloadUserForm({ handleReloadButtonClick, userId, setUserId }) {
  return (
    <div>
      <label htmlFor="userId" className="sr-only">
        User ID
      </label>
      <input
        type="text"
        name="userId"
        id="userId"
        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="user id"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button
        type="button"
        onClick={handleReloadButtonClick}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Reload User
      </button>
    </div>
  );
}

export default ReloadUserForm;
