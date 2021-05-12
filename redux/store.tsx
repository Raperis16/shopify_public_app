// Redux
import { createStore } from "redux";

// Combined reducer import
import rootReducer from "./rootReducer";

// Redux-Persist 
import { persistStore } from "redux-persist";


const Store = createStore(rootReducer);
const Persistor = persistStore(Store);


export default {Store, Persistor};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch