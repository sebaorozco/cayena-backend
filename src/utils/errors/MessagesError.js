export const generateProductErrorInfo = (product) => {
    return `One or more of the following fields are invalid or incomplete.
    List of required fields:
      * title: needs to be a string, received ${product.title}
      * description: needs to be a string, received ${product.description}
      * code: needs to be a string, received ${product.code}
      * price: needs to be a number, received ${product.price}
      * stock: needs to be a number, received ${product.stock}
      * category: needs to be a string, received ${product.category}
      `
}

export const generateUsersErrorInfo = (user) => {
    return `One or more of the following fields are invalid or incomplete.
    List of required fields:
      * name: needs to be a string, received ${user.name}
      * email: needs to be a string, received ${user.email}
      * age: needs to be a number, received${user.age}
      * cart: needs to be an objectId, received ${user.cart}
      * ticket: needs to be an objectId, received ${user.ticket}
      `
}