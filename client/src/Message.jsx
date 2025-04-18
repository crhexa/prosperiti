export default function Message({origin, body}){

    return (
        <div className={`flex ${origin=='user' ? "justify-end" : "justify-start"} justify-end mb-2`}>
            <div
                className={` mt-4 p-3 rounded-lg  ${origin=='user' ? 'border-r-4 border-grey-200' : 'border-l-4 border-green-500'} max-w-xs md:max-w-md px-4 py-2 shadow`}>
                {body}
            </div>
        </div>
    )
}