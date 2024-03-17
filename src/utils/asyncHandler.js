const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

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
