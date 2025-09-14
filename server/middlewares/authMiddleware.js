import { clerkClient } from "@clerk/express";


// protect educator routes

export const protectEducator = async (req,res,next) => {
    try {
        const userId = req.auth().userId;
        const response = await clerkClient.users.getUser(userId);
        if(response.publicMetadata.role !== 'educator'){
            return res.status(403).json({message: 'You are not authorized to access this route'});
        }
        next();
    } catch (error) {
        res.status(500).json({message: 'An error occurred while verifying educator status',error: error.message});
    }
}