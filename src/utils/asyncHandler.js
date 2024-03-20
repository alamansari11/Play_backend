const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// this code allows you to wrap an asynchronous request handler function (requestHandler) with error handling. It ensures that any errors thrown within requestHandler are caught and passed to the Express.js next function, allowing for centralized error handling within an Express.js application.

// const asyncHandler = () => {}
// const asyncHandler = (func) =>  () => {}
// const asyncHandler = (func) =>  aync () => {}

// const asyncHandler = (fn) => async(req,res,next)=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

export default asyncHandler;
