# jobTracker
Track your applications with ease. 

Its been built using TypeScript, though allowing for it to infer most of the types, hence the ```"noImplicitAny": false``` that can be found in the tsconfig.json.

## local setup
### client setup
We recommend to use node 20 when running this repo. This was the latest LTS version when this projects packages were first installed.

node >= 20

Don't forget to install the dependencies on the first time ;).

first time:
```npm install && npm run dev```

afterwards:
```npm run dev```

### server setup
Temporarily using a server residing on a different repo: ferpar/express-auth-starter

## running the tests
```npm run test```

## additional considerations

### Lifecycle of architectural components (Singletons / Transients)
- All Gateways are Transients
- All Repositories are Singletons as it is to be expected
- The Authors Presenter is a Singleton as instructed
- Every other Part of the Reactive Core is a Transient by default

### Naming Convention
- The "Component" surname is being removed from the React Components (i.e.: AuthorsComponent => Authors)

### Authors Feature Particularities
- To reuse the BookListPresenter a separate book-list and a flag variable "bufferMode" was created at the BooksRepository so as to not mix an array storing data from the api, with that of an input from the UI. Whenever the AuthorsPresenter is loaded, we set the variable to true so that the BookListPresenter reads from the "buffer" array instead of the list of books coming from the API.

### Routing and Initialization
- The Books Repository is being loaded / reset via the Router
- The Authors Repository and Presenter are being loaded / reset via React.useEffect as instructed on the exercise. Personally, I would rather keep doing this in the Router
- The "before" hook provided by Navigo has been used instead of the "uses" property. But this currently has no effect because we are not "awaiting" for it to end before switching the route. This was intentional, for the matter of not overcomplicating the exercise, but the purpose is to explore the possibility of making sure some processes are finished before we switch a route. To see this in action it will suffice to set async/await on the chain of actions related to the before hook, and its contents.

### Authentication
- The token is being stored in LocalStorage so that there's no need to log back in after refresh, a new Gateway was created for this. ```./Core/LocalStorage/LocalStorageGateway.ts```

### CSS and components
Since the exercise is not about CSS/HTML I took the liberty not to follow the same CSS template provided.