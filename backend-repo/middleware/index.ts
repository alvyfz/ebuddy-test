


const middleware = async (req: any, res: any, next: any) => {
    try {
        // access token value FB
        // const authHeader = req.headers.authorization || "";

        // const idToken = authHeader.startsWith("Bearer ")
        //     ? authHeader.substring(7, authHeader.length)
        //     : null;

        // if (!idToken) throw new Error("Unauthorized");

        // const decodedToken = await adminAuth.auth().verifyIdToken(idToken);

        // res.locals.decodedToken = decodedToken;
        return next();
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "service unavailable",
            dev: error.message,
        });
    }
};

export {
    middleware
}