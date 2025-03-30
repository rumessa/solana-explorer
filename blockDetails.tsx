import React from 'react';
import { View, Text, StyleSheet, ScrollView, ToastAndroid, TouchableOpacity } from 'react-native';
import { theme } from './assets/theme';
import * as Clipboard from 'expo-clipboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BlockDetails = ({ route}) => {
  const { block } = route.params; 

  // shorten hash
  const truncateHash = (hash: string, maxLength: number = 10) => {
    if (hash.length <= maxLength) return hash;
    // Conditionally truncate based on maxLength
    if (maxLength === 10) {
      return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
    } else {
      return `${hash.slice(0, 4)}...${hash.slice(-4)}`;
    }
  };

  // for copying hash/block number
  const copyToClipboard = async (text: string | number) => {
    try {
      const stringToCopy = text.toString();
      await Clipboard.setStringAsync(stringToCopy);  
      ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);  
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      ToastAndroid.show("Could not copy to clipboard!", ToastAndroid.SHORT); 
    }
  };

  // convert time to 17m ago, 3s ago etc
  const getRelativeTime = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const diff = now - timestamp; 
  
    if (diff < 60) return `${diff}s ago`; 
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`; 
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; 
    return `${Math.floor(diff / 86400)}d ago`; 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.miniBlock}>
        <TouchableOpacity onPress={() => copyToClipboard(block.blocknumber)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 5, gap: 10}}>
          <Text style={theme.headings.secondary}>#{block.blocknumber}</Text>
          <MaterialIcons name="content-copy" size={20} color="grey" />
        </TouchableOpacity>
      </View>

      <View style={styles.miniBlock}>
        <Text style={styles.headingText}>Hash:</Text>
        <TouchableOpacity onPress={() => copyToClipboard(block.blockhash)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 5, gap: 10 }}>
          <Text style={styles.text}>{truncateHash(block.blockhash)}</Text>
          <MaterialIcons name="content-copy" size={20} color="grey" />
        </TouchableOpacity>
      </View>

      <View style={styles.miniBlock}>
        <Text style={styles.headingText}>Previous Block Hash:</Text>
        <Text style={styles.text}>{truncateHash(block.previousblockhash, 12)}</Text>
      </View>

      <View style={styles.miniBlock}>
        <Text style={styles.headingText}>Timestamp:</Text>
        <Text style={styles.text}>{getRelativeTime(block.blocktime.absolute)}</Text>
      </View>

      <View style={styles.miniBlock}>
        <Text style={styles.headingText}>Transactions:</Text>
        <Text style={styles.text}>{block.metrics.txcount}</Text>
      </View>

      <View style={styles.miniBlock}>
        <Text style={styles.headingText}>Failed Transactions:</Text>
        <Text style={styles.text}>{block.metrics.failedtxs}</Text>
      </View>

      <View style={styles.miniBlock}>
        <Text style={styles.headingText}>Successful Transactions:</Text>
        <Text style={styles.text}>{block.metrics.sucessfultxs}</Text>
      </View>

      <View style={styles.miniBlock}>
        <Text style={styles.headingText}>Total Fees:</Text>
        <Text style={styles.text}>{(block.metrics.totalfees / 1000000000).toFixed(4)} SOL</Text>
      </View>

      <View style={styles.miniBlock}>
        <Text style={styles.headingText}>Proposer:</Text>
        <Text style={styles.text}>{truncateHash(block.proposer)}</Text>
      </View>

      <View style={styles.miniBlock}>
        <Text style={styles.headingText}>Previous Slot:</Text>
        <Text style={styles.text}>{block.parentslot}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  miniBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, 
  },
  headingText: {
    color: theme.colors.grey, 
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5, 
  },
  text: {
    color: theme.colors.white, 
    fontSize: 18,
  },
});

export default BlockDetails;
