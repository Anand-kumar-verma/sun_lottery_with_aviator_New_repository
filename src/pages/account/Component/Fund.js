import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import { Box, Button, Container, FormControl, MenuItem, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { zubgback, zubgbackgrad, zubgmid } from '../../../Shared/color';
import Layout from '../../../component/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { endpoint, rupees } from '../../../services/urls';
import CryptoJS from "crypto-js";
import { MyProfileDataFn, walletamount, walletamountAviator } from '../../../services/apicalling';
import { useQuery, useQueryClient } from 'react-query';
import CustomCircularProgress from '../../../Shared/CustomCircularProgress';

function Fund() {
    const navigate = useNavigate();
    const [selected, setSelected] = React.useState('Fund Transfer');
    const [amount, setAmount] = React.useState(0);
    const [loding ,setLoading] = React.useState(false)
    const client = useQueryClient()
    const value =
        (localStorage.getItem("logindataen") &&
            CryptoJS.AES.decrypt(
                localStorage.getItem("logindataen"),
                "anand"
            )?.toString(CryptoJS.enc.Utf8)) ||
        null;
    const user_id = value && JSON.parse(value)?.UserID;


    const handleSubmit = () => {
        if (selected === "Fund Transfer")
            return toast("Please select you account type");
        const reqBody = {
            "user_id": user_id,
            "amount": amount
        }
        if (selected === "MainToAviator") {
            sendWalletTOaviator(reqBody);
        } else {
            sendaviatorToWallet(reqBody);
        }


    };
    const goBack = () => {
        navigate(-1);
    };

    async function sendWalletTOaviator(reqbody) {
        try {
            setLoading(true);
            const response = await axios.post(endpoint.node_api.main_wallet, reqbody);
            toast(response?.data?.msg)
            setSelected('Fund Transfer');
            setAmount(0)
            client.refetchQueries("walletamount_aviator")
            client.refetchQueries("myprofile")
            client.refetchQueries("walletamount")
            setLoading(false)
        } catch (e) {
            toast("Something went wrong")
        }
    }
    async function sendaviatorToWallet(reqbody) {
        try {
            setLoading(true)
            const response = await axios.post(endpoint.node_api.aviator_main, reqbody);
            toast(response?.data?.msg)
            setSelected('Fund Transfer');
            setAmount(0)
            client.refetchQueries("walletamount_aviator")
            client.refetchQueries("myprofile")
            setLoading(false)
        } catch (e) {
            toast("Something went wrong")
        }
    }


    const { isLoading: walletloding, data: walletdata } = useQuery(
        ["walletamount_aviator"],
        () => walletamountAviator(),
        {
            refetchOnMount: false,
            refetchOnReconnect: true,
        }
    );

    const walletAmount = walletdata?.data?.data || 0;

    const { isLoading, data } = useQuery(["myprofile"], () => MyProfileDataFn(), {
        refetchOnMount: false,
        refetchOnReconnect: true,
    });
    const result = data?.data?.data;


    return (
        <Layout>
            <Container sx={style.container}>
                <Box sx={style.header}>
                    <Box component={NavLink} onClick={() => goBack()}>
                        <KeyboardArrowLeftOutlinedIcon />
                    </Box>
                    <Typography variant="body1" color="initial">Fund Transfer</Typography>
                    <Typography variant="body1" color="initial"> </Typography>
                </Box>
                <Box sx={{
                    width: '95%', marginLeft: '2.5%', background: zubgmid,
                    borderRadius: '10px', padding: '10px', mt: '10px',
                }}>
                    <div className='!text-white !flex !justify-between'>
                        <span>
                            Main Wallet : {rupees} {Number(result?.wallet || 0)?.toFixed(2)}
                        </span>
                        <sapn>
                            Aviator Wallet : {rupees} {Number(
                                Number(walletAmount?.wallet || 0) +
                                Number(walletAmount?.winning || 0)
                            ).toFixed(2) || "0000"}
                        </sapn>
                    </div>
                    <Box mt={2} component='form'>
                        <Box mt={2}>
                            <FormControl fullWidth sx={{ mt: "10px" }}>

                                <TextField
                                    select
                                    value={selected}
                                    onChange={(e) => { setSelected(e.target.value) }}
                                    className="withdrawalfield"
                                    type='number'
                                    placeholder='Fund Transfer'
                                    InputProps={{
                                        style: {
                                            borderColor: "#4939c1",
                                            borderWidth: "1px",
                                            color: "white",
                                            background: "#281970",
                                            borderRadius: "10px",
                                        },
                                    }}
                                >
                                    <MenuItem value={"Fund Transfer"}>Fund Transfer</MenuItem>
                                    <MenuItem value="MainToAviator">Main Wallet to Aviator Wallet</MenuItem>
                                    <MenuItem value="AviatorToMain">Aviator Wallet to Main Wallet</MenuItem>
                                </TextField>


                                <>
                                    <Stack direction="row" className="mt-5 !text-sm text-white">
                                        <Typography variant="" className=''>
                                            Amount <span className="!text-red-600">*</span>
                                        </Typography>
                                    </Stack>
                                    <TextField
                                        fullWidth
                                        type='number'
                                        value={amount}
                                        className="withdrawalfield"
                                        placeholder="Enter amount eg. 1000"
                                        onChange={(e) => setAmount(e.target.value)}
                                        InputProps={{
                                            style: {
                                                borderColor: "#4939c1",
                                                borderWidth: "1px",
                                                color: "white",
                                                background: "#281970",
                                                borderRadius: "10px",
                                            },
                                        }}
                                    />
                                    <Box sx={{
                                        width: '95%', marginLeft: '2.5%', background: zubgmid,
                                        borderRadius: '10px', padding: '10px', mt: '10px',
                                    }}>
                                        <Button sx={style.paytmbtntwo}
                                            onClick={handleSubmit}> Submit</Button>
                                    </Box>
                                    <CustomCircularProgress isLoading={loding}/>
                                </>



                            </FormControl>

                        </Box>
                    </Box>
                </Box>

            </Container>
        </Layout>
    );
};

export default Fund;


export const style = {
    container: { background: zubgback, width: '100%', height: '100vh', overflow: 'auto', },
    header: {
        padding: '15px 8px',
        background: zubgback,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& > p': {
            fontSize: '20px',
            fontWeight: '600',
            textAlign: 'center',
            color: 'white',
        },
        '& > a > svg': {
            color: 'white',
            fontSize: '35px'
        }
    },
    notificationBox: {
        width: '95%', marginLeft: '2.5%', borderRadius: '10px', background: zubgmid, padding: '10px', mt: '10px',
        '&>div>div>p': { color: 'white', fontSize: '14px', marginLeft: '10px', fontWeight: '500', },
        '&>p': { color: 'white', fontSize: '13px', marginLeft: '0px', fontWeight: '500', mt: '10px', },
        '&>div>div>svg': { color: 'white', fontSize: '24px', }, '&>div>svg': { color: 'white', fontSize: '24px', },
    },
    notificationStack: { alignItems: 'center', justifyContent: 'space-between', },
    paytmbtntwo: { borderRadius: '5px', textTransform: 'capitalize', mb: 2, background: zubgmid, color: 'white !important', width: '100%', mt: '20px', border: "1px solid white", padding: '10px', '&:hover': { background: zubgbackgrad, border: "1px solid transparent", } },

};
