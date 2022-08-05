export class data{

    public type: string
    public name : string
    public offer : RTCSessionDescriptionInit | null
    public answer : RTCSessionDescriptionInit | null
    public candidate : RTCIceCandidate | null

    constructor(type : string, name : string, offer : RTCSessionDescriptionInit | null, answer : RTCSessionDescriptionInit | null, candidate : RTCIceCandidate | null ){
        this.type = type
        this.name = name || ""
        this.offer = offer || null
        this.answer = answer || null
        this.candidate = candidate || null
    }

    
    public getType(): string {
        return this.type
    }
    public setType(value: string) {
        this.type = value
    }

    public getName(): string {
        return this.name
    }
    public setName(name: string) {
        this.name = name
    }

    public getOffer(): RTCSessionDescriptionInit | null{
        return this.offer
    }
    public setOffer(offer: RTCSessionDescriptionInit) {
        this.offer = offer
    }

    public getAnswer(): RTCSessionDescriptionInit | null {
        return this.answer
    }
    public setAnswer(answer: RTCSessionDescriptionInit) {
        this.answer = answer
    }

    public getCandidate(): RTCIceCandidate | null{
        return this.candidate
    }
    public SetCandidate(candidate: RTCIceCandidate) {
        this.candidate = candidate
    }





    
    
}