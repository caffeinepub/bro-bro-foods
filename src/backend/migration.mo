import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type PlateType = {
    id : Nat;
    name : Text;
    price : Nat;
  };

  type KxlBankAccount = {
    accountHolder : Text;
    accountNumber : Text;
    ifscCode : Text;
    upiId : Text;
    bankName : Text;
  };

  type PaymentMethod = {
    id : Nat;
    name : Text;
    description : Text;
    kxlBankAccount : ?KxlBankAccount;
    upiId : ?Text;
    qrcodeUrl : ?Text;
  };

  type PaymentConfirmation = {
    utr : Text;
    paidVia : Text;
    paymentMethodId : Nat;
    paidAt : Time.Time;
  };

  type OrderStatus = {
    #pending;
    #accepted;
    #preparing;
    #readyToDeliver;
    #outForDelivery;
    #delivered;
    #cancelled;
  };

  type StatusChangeEvent = {
    status : OrderStatus;
    changedAt : Time.Time;
    changedBy : Text;
  };

  type Order = {
    id : Nat;
    plateTypeId : Nat;
    plateTypeName : Text;
    price : Nat;
    quantity : Nat;
    totalAmount : Nat;
    createdAt : Time.Time;
    paymentMethodId : ?Nat;
    paymentConfirmation : ?PaymentConfirmation;
    status : OrderStatus;
    statusEvents : [StatusChangeEvent];
  };

  type BuildStatus = {
    buildSucceeded : Bool;
    buildOutput : Text;
    appInstallationSucceeded : Bool;
    appInstallationOutput : Text;
    deploySucceeded : Bool;
    deployOutput : Text;
  };

  type LastBuildStatus = {
    timestamp : Time.Time;
    status : BuildStatus;
  };

  type OldActor = {
    orders : Map.Map<Nat, Order>;
    nextOrderId : Nat;
  };

  type NewActor = {
    orders : Map.Map<Nat, Order>;
    nextOrderId : Nat;
    lastBuildStatus : ?LastBuildStatus;
  };

  public func run(old : OldActor) : NewActor {
    {
      orders = old.orders;
      nextOrderId = old.nextOrderId;
      lastBuildStatus = null;
    };
  };
};
