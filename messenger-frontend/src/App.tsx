import { RouterProvider, createBrowserRouter } from "react-router-dom"
import RootLayout from "./Layouts/RootLayout";
import ChatPage from "./pages/ChatPage";
import FriendsPage from "./pages/FriendsPage";


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>,
    errorElement: <h1>Error</h1>,
    children: [
      {
        path: 'chats',
        children: [
          { 
            index: true,
            element: <ChatPage/>
          },
          {
            path: ':chatId',
            element: <ChatPage/>
          }
        ]
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: <FriendsPage/>
          },
          {
            path: ':userId',
            element: <h1>Tutaj wyswietli sie profil uzytkownika</h1>
          }
        ]
      },
      {
        path: 'login',
        element: <h1>Tu bedzie strona logowania</h1>
      },
      {
        path: 'signup',
        element: <h1>Tu bedzie tworzenie konta</h1>
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
