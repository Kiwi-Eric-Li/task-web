



export default function OwnerOfferList({taskId, offers, hasMatched, onMutate, status, allowActions = true}){
    return (
        <div>{taskId}-{offers.length}</div>
    )
}