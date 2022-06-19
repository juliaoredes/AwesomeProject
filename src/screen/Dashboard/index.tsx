import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';


import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer,
} from "./styles";

import { RFValue } from "react-native-responsive-fontsize";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCards";
import { LastTransaction } from "../../components/HighlightCard/styles";


export interface DatalistProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
  }
  
interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps
}
  


export function Dashboard(){
    const [isLoading, setisLoading] = useState(true);
    const [transactions, setTransactions] = useState<DatalistProps[]>([]);
    const [highlightData, sethighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();

    function getLastTransactionDate(
        collection: DatalistProps[], 
        type: 'positive'|'negative'
    ){
            
        const lastTransaction = new Date(
        Math.max.apply(Math, collection
        .filter(transactions => transactions.type === type)
        .map(transactions => new Date(transactions.date).getTime())))

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`;
        
    }

    async function loadTransaction(){
        const dataKey =  '@AwesomeProject:transactions';
        const response = await AsyncStorage.getItem(dataKey);

        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;


        const transactionsFormatted: DatalistProps[] = transactions
        .map((item: DatalistProps) =>{

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            }else{
                expensiveTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'

            });

            const date = Intl.DateTimeFormat('pt-Br', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));
            
            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
                
                }
            });



            setTransactions(transactionsFormatted);

            const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
            const lastTransactionExpesives = getLastTransactionDate(transactions, 'negative');
            const totalInterval = `01 a ${lastTransactionExpesives}`;
            
            const total = entriesTotal - expensiveTotal;
            
            sethighlightData({
                entries: {
                    amount: entriesTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
                },
                expensives: {
                    amount: expensiveTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: `Última saída dia ${lastTransactionExpesives}`,
                 },
                 total: {
                    amount: total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: totalInterval
                 }
            });

            setisLoading(false);

    }

    useEffect(() => {
        loadTransaction();

        // const dataKey =  '@AwesomeProject:transactions';
        // AsyncStorage.removeItem(dataKey);
    },[]);

    useFocusEffect(useCallback(() => {
        loadTransaction();
    },[]));

    return (
    <Container>
                {
                    isLoading ?
                    <LoadContainer>
                         <ActivityIndicator 
                            color={theme.colors.primary} 
                            size="large"
                         /> 
                    </LoadContainer>: 
                    <>
                    <Header>
                    <UserWrapper>
                            <UserInfo>
                                <Photo 
                                    source={{ uri: 'https://avatars.githubusercontent.com/u/49030804?v=4'}}
                                />
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>Rodrigo</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={() => {}}>
                                <Icon name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>
                    <HighlightCards>
                    <HighlightCard 
                        type="up"
                        title="Entradas" 
                        amount={highlightData.entries.amount}
                        lastTransaction={highlightData.entries.lastTransaction}
                    />
                <HighlightCard 
                        type="down"
                        title="Saídas" 
                        amount={highlightData.expensives.amount}
                        lastTransaction={highlightData.expensives.lastTransaction}
                    />
                    <HighlightCard 
                        type="total"
                        title="Total" 
                        amount={highlightData.total.amount}
                        lastTransaction={highlightData.total.lastTransaction}
                    />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionList 
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) =>  <TransactionCard data={item} /> }
                        />

                        
                
                </Transactions>  
            </>
        }
    </Container>

    )
}

