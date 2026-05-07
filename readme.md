# Express CRUD Backend

This is a simple Express.js backend application that provides CRUD (Create, Read, Update, Delete) operations for managing a collection of items. The application uses an in-memory array to store the items, making it easy to test and understand the basic CRUD operations.

## Read operations

- **GET /items**: Retrieve a list of all items.

```text
app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
```

- **GET /items/:id**: Retrieve a specific item by its ID.

```text
app.get("/users/:userId", async (req, res) => {
      const userId = req.params.userId;
      const query = {
        _id: new ObjectId(userId)
      }
      const user = await userCollection.findOne(query)
      res.send(user);
    });
```

- **DELETE /items/:id**: Delete a specific item by its ID.
  -Server side code for delete operation

```text
app.delete("/users/:userId", async (req, res) => {
      const userId = req.params.userId;
      const query = {
        _id: new ObjectId(userId),
      };
      const deleteUser = await userCollection.deleteOne(query);
      res.send(deleteUser);
    });
```

-Client side code for delete operation

create a delete action that sends a DELETE request to the server

```text
import { revalidatePath } from "next/cache";
export const DeleteUserAction = async (userId) => {
  "use server";
  const res = await fetch(`http://localhost:8000/users/${userId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  // revalidation
  if (data.deletedCount > 0) {
    revalidatePath('/users')
  } return data;
};
```

In a server-side component, create a delete button component and pass the user and delete action as props

```text
<DeleteButton user={user} DeleteUserAction={DeleteUserAction} />
```

create delete button onClick handler that calls the delete action with the user id

```text
 const manageDelete = async (userId) => {
    await DeleteUserAction(userId)
  };
```

- **POST /items**: Create a new item.

- Server side code for create operation

```text
app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
```

- Client side code for create operation server action that sends a POST request to the server
  server-side component

```text
export const InsertUserAction = async (formData) => {
  "use server";
  const userData = Object.fromEntries(formData.entries())
  const response = await fetch("http://localhost:8000/users", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (data.insertedId) {
    revalidatePath('/users')
  }
  return data;
};
```

-In server-side component, create a form component and pass the insert action as a prop

```text
<InsertModal InsertUserAction={ InsertUserAction} />
```

-**PUT /items/:id**: Update a specific item by its ID.
-Server side code for update operation

```text
app.patch("/users/:userId", async (req, res) => {
      const userId = req.params.userId;
      const filter = {
        _id: new ObjectId(userId),
      };
      const updatedUser = req.body;
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
          designation: updatedUser.designation,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
```

-Client side code for update operation
create an update action that sends a PATCH request to the server

```text
export const UserUpdateAction = async (userId, formData) => {
  const updateUserData = Object.fromEntries(formData.entries());
  const response = await fetch(`http://localhost:8000/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(updateUserData),
  });
  const data = await response.json();
  if (data.modifiedCount > 0) {
    revalidatePath("/users");
    redirect("/users");
  }
  return data;
};
```

-In a server-side component, create an update form component and wrap it in an async function and pass user id and form data to the update Action

```text
 const { userId } = await params;
  const userData = await getUserById(userId);
  const UserUpdateWrapper = async (formData) => {
    "use server";
    return UserUpdateAction(userId, formData);
  };
```

-**dotenv file**

```text
npm install dotenv
```

-Add the following line to the top of your index.js file to load environment variables from the .env file

```text
require("dotenv").config();
```
