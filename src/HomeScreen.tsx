import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text,
  Button
} from "react-native";
import { Appbar, DataTable, FAB } from "react-native-paper";
import {
  NavigationEvents,
  SafeAreaView,
  NavigationInjectedProps
} from "react-navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectors, actions } from "./store/inventory";
import { RootState } from "./store";

export default (props: NavigationInjectedProps) => {
  const fetching = useSelector((state: RootState) => state.inventory.fetching);
  const inventory = useSelector(selectors.selectInventory);
  const dispatch = useDispatch();
  const [filterValue, setFilterValue] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <NavigationEvents
        onWillFocus={() => dispatch(actions.fetchInventory())}
      />
      <Appbar.Header>
        <Appbar.Content title="Inventory" />
      </Appbar.Header>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={fetching}
            onRefresh={() => dispatch(actions.fetchInventory())}
          />
        }
      >
        <SafeAreaView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Product Code</DataTable.Title>
              <DataTable.Title numeric>Scan Date</DataTable.Title>
            </DataTable.Header>
            <TextInput
              style={styles.textInput}
              placeholder={"Filter by Code:"}
              onChangeText={value => setFilterValue(value)}
              value={filterValue}
            />
            <Button title={"Reset"} onPress={() => setFilterValue("")} />
            {inventory.map((record, index) => {
              if (record.fields["Product Code"].includes(filterValue)) {
                return (
                  <DataTable.Row key={index}>
                    {/* Index as a key is an anti pattern. Objects should have a unique identifier.
                     https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318 */}
                    <DataTable.Cell>
                      {record.fields["Product Code"]}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {new Date(record.fields.Posted).toLocaleDateString()}{" "}
                      {new Date(record.fields.Posted).toLocaleTimeString()}
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              }
            })}
          </DataTable>
        </SafeAreaView>
      </ScrollView>

      <SafeAreaView style={styles.fab}>
        <FAB
          icon={() => (
            <MaterialCommunityIcons name="barcode" size={24} color="#0B5549" />
          )}
          label="Scan Product"
          onPress={() => props.navigation.navigate("Camera")}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flex: 1,
    alignItems: "center"
  },
  textInput: {
    borderWidth: 2,
    borderColor: "lightgrey",
    padding: 5,
    margin: 5
  }
});
