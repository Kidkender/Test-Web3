import React ,{useEffect ,useState} from "react";
import {ethers} from "ethers";
import {contractABI,contractAddress} from "../utils/constants";

export const TransactionContext =React.createContext();

const {ethereum}    =window;

const getEthereumContract =()=>{
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
}

export const TransactionProvider =({children}) => {
 
    const [currentAccount,setcurrentAccount] =useState('');
    const [formData ,setFormData] = useState({addressTo:'' ,amount:'',keyword:'',message:''});
    const [isLoading, setisLoading] = useState(false);
    const [transactionCount, settransactionCount] = useState(localStorage.getItem("transactionCount"));

    const [transactions, settransactions] = useState([]);

    const handleChange =(e,name)=>{
        setFormData((prevState) =>({...prevState,[name]:e.target.value}));

    }
    
    const getAllTransactions = async ()=>{
        try {
            if(ethereum)
            {
                const transactionsContract= getEthereumContract();
                const availableTransactions = await transactionsContract.getAllTransactions();
                const structuredTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(transaction.timestamp.toNumber()*1000 ).toLocaleString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    amount: parseInt(transaction.amount._hex)/(10**18)
                }) );
                console.log(structuredTransactions)
                settransactions(structuredTransactions);
                // console.log(availableTransactions)
            }
            else{
                console.log("Ethereum is not present"); 
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkIfWalletConnected = async ()=>{

        try {
            if(!ethereum) return alert("Please install metamask");
    
            const accounts = await ethereum.request({ method: "eth_accounts" });
    
            if(accounts.length){
                setcurrentAccount(accounts[0]);
    
                getAllTransactions();
            }
            else{
                console.log("No accounts found ");
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            // throw new Error("No ethereum object.");
        }

       
    };

    const checkIfTransactionsExist = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEthereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          }
        } catch (error) {
          console.log(error);
          throw new Error("No ethereum object");
        }
      };

    const connectWallet = async ()=>{
        try {
            if(!ethereum) return alert("Please install metamask");
                //method eth_requestAccounts : Login Account ETH in your metamask 
            const accounts = await ethereum.request({ method: "eth_requestAccounts", });

            setcurrentAccount(accounts[0]);
            window.location.reload();
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.");
        }
    };

    // const sendTransaction = async ()=>{
    //     try {
    //         if(ethereum)
    //         {
    //             // Get the data from the form...
    //             const {addressTo,amount,keyword,message} =formData;
    //             const transactionsContract= getEthereumContract();
    //             const parsedAmount =ethers.utils.parseEther(amount);

    //             await ethereum.request({
    //                 method: "eth_sendTransaction",
    //                 params: [{
    //                 from: currentAccount,
    //                 to: addressTo,
    //                 gas: "0x5208",
    //                 value: parsedAmount._hex,
    //                 }],
    //             });

    //             const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, keyword, message);    
    //             setisLoading(true);
    //             console.log(`Loading - ${transactionHash.hash}`);
    //             await transactionHash.wait();
                
    //             console.log(`Success - ${transactionHash.hash}`);
    //             setisLoading(false);
    //             const transactionCount = await transactionsContract.getTransactionCount();
    //             settransactionCount(transactionCount.toNumber());
    //             window.location.reload();
    //         }
    //         else{
    //             console.log("No Ethereum object")
    //         }
    // } catch (error) {
    //         console.log(error);
    //         throw new Error("No ethereum object.");
    //     }
    // };    
 
    const sendTransaction = async () => {
        try {
          if (ethereum) {
            const { addressTo, amount, keyword, message } = formData;
            const transactionsContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
    
            await ethereum.request({
              method: "eth_sendTransaction",
              params: [{
                from: currentAccount,
                to: addressTo,
                gas: "0x5208",
                value: parsedAmount._hex,
              }],
            });
    
            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setisLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setisLoading(false);
    
            const transactionsCount = await transactionsContract.getTransactionCount();
    
            settransactionCount(transactionsCount.toNumber());
            window.location.reload();
          } else {
            console.log("No ethereum object");
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

      
    useEffect(() => {
        checkIfWalletConnected();
        checkIfTransactionsExist();
       
    }, [transactionCount]);

    return(
        <TransactionContext.Provider 
        value={{connectWallet , 
                currentAccount,
                formData,
                setFormData,
                handleChange,
                sendTransaction,
                transactions,
                isLoading,
                transactionCount,
                }}>
            {children}
        </TransactionContext.Provider>
    );
};