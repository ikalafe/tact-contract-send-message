import "@stdlib/deploy";
// this message will cause our contract to add an amount to the counter
message Add {
    amount: Int as uint32;
}
// this message will cause our contract to subtract an amount from the counter
message Subtract {
    amount: Int as uint32;
}
// this message will cause our contract to do a complex math operation on the counter
message MultiMath {
    ops: Operations;
}

struct Operations {
    add: Int as uint32;
    subtract: Int as uint32;
    multiply: Int as uint32;
}

contract Messages with Deployable {
    val: Int as int64;
    init(){
        self.val = 0;
    }

    // handler for the receive TON without any messages
    receive(){}

    // handle for the "Add" message - this is a binary message that has an input argument (amount)
    receive(msg: Add){
        self.val += msg.amount;
    }

    // handler for the "Subtract" message - this is a different binary message although its format is different
    receive(msg: Subtract){
        self.val -= msg.amount;
    }

    // handler for the "MultiMath" message - this is a binary message that hold multiple input arguments
    receive(msg: MultiMath){
        self.val += msg.ops.add;
        self.val -= msg.ops.subtract;
        self.val *= msg.ops.multiply;
    }

    // handler for "increment" textual message - this is a textual string message, these cannot cause
    receive("increment"){
        self.val += 1;
    }

    // handler for "decrement" textual message - this is a different textual string message, you can have multiple handlers for the same message
    receive("decrement"){
        self.val -= 1;
    }

    // if none of the previus receivers match the comment string, this one is called
    receive(msg: String){
        // ..
    }

    //
    receive(msg: Slice){
        // ..
    }

    get fun vlaue(): Int {
        return self.val;
    }
}