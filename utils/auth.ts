import jwt from "jsonwebtoken";

const secret: string = "mysuper duper secret ";
const expiration: string = "2h";

export const authMiddleware = ({ req }: { req: any }) => {
  let token: string | null =
    req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token?.split(" ")?.pop()?.trim() ?? null;
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration }) as {
      data: any;
    };
    req.user = data;
  } catch {
    console.log("Invalid token");
  }

  return req;
};

export const signToken = ({
  firstName,
  email,
  _id,
}: {
  firstName: string;
  email: string;
  _id: string;
}) => {
  const payload = { firstName, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};
