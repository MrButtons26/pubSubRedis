import { createClient, RedisClientType } from "redis";



class pubSubManager {
  private static instance: pubSubManager;
  private stockMap:Map<string,string[]>
  private client:RedisClientType
  private constructor() {
    this.client= createClient()
    this.stockMap=new Map()
  }
  public static getInstance() {
    if (pubSubManager.instance) {
      return pubSubManager.instance;
    }
    pubSubManager.instance = new pubSubManager();
    return pubSubManager.instance;
  }
  async addUserToStock(userID:string,stockName:string){
   if(!this.stockMap.has(stockName)){
    this.stockMap.set(stockName,[])
    this.stockMap.get(stockName)?.push(userID)
   
  if(this.stockMap.get(stockName)?.length===1){
   await this.client.subscribe(stockName, (message) => {
   this.sendData(stockName,message)
  });
}
   }
   else{
    const tempArray:any=this.stockMap.get(stockName)?.push(userID)
     this.stockMap.set(stockName,tempArray)
   }
   console.log(this.stockMap)
  }
    async removeUserFromStock(userID:string,stockName:string){
  this.stockMap.set(stockName,this.stockMap.get(stockName)?.filter((el)=>el!=userID)||[]) 
  if(this.stockMap.get(stockName)?.length===0){
    await this.client.unsubscribe(stockName)
  }
  }
  async sendData(stockName:string,message:string){
      console.log(stockName,message)
  }
}
const manager = pubSubManager.getInstance();
export default manager;
