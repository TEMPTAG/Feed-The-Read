import User from "../models/index.js";
import { signToken, AuthenticationError } from "../utils/auth.js";

// Define types for the arguments used in mutations
interface LoginUserArgs {
  email: string;
  password: string;
}

interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface SaveBookArgs {
  input: {
    authors: string[];
    description: string;
    title: string;
    bookId: string;
    image: string;
    link: string;
  };
}

interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  Query: {
    // Resolver for the "me" query, which returns the authenticated user's data
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("Could not authenticate user.");
    },
  },

  Mutation: {
    // Resolver for logging in a user
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Could not authenticate user.");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Could not authenticate user.");
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Resolver for adding a new user (sign up)
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Resolver for saving a book to the user's savedBooks array
    saveBook: async (_parent: any, { input }: SaveBookArgs, context: any) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError("You need to be logged in to Save a Book!");
    },

    // Resolver for removing a book from the user's savedBooks array
    removeBook: async (
      _parent: any,
      { bookId }: RemoveBookArgs,
      context: any
    ) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: bookId } },
          { new: true }
        );
      }
      throw new AuthenticationError(
        "You need to be logged in to Remove a Book!"
      );
    },
  },
};

// Export the resolvers object for use in GraphQL schema
export default resolvers;
