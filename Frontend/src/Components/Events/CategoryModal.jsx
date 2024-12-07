import React from 'react';

const CategoryModal = React.memo(({
  categoryForm,
  setCategoryForm,
  handleCategorySubmit,
  closeCategoryModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-purple-400 mb-6">Add New Category</h3>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label className="block text-purple-300 mb-2">Category Name</label>
              <input
                type="text"
                value={categoryForm.categoryName}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, categoryName: e.target.value })
                }
                className="w-full bg-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeCategoryModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default CategoryModal; 