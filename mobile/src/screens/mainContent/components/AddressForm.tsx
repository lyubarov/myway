import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { DownIcon } from "@assets/svg/DownIcon";

export const AddressForm = ({
  city,
  setCity,
  branch,
  setBranch,
  street,
  setStreet,
  houseNumber,
  setHouseNumber,
  apartment,
  setApartment,
  cityList,
  showCityDropdown,
  setShowCityDropdown,
  branchList,
  showBranchDropdown,
  setShowBranchDropdown,
  streetList,
  showStreetDropdown,
  setShowStreetDropdown,
  fetchCities,
  fetchStreets,
}) => {
  return (
    <View className="mt-3">
      {/* Вибір міста */}
      <View className="relative">
        <TextInput
          placeholder="Оберіть місто"
          value={city}
          onChangeText={(text) => {
            setCity(text);
            fetchCities(text); // Виклик запиту з debounce
          }}
          className={`bg-lightLightGray p-5 pr-12 mb-2 flex-row items-center ${
            showCityDropdown ? "rounded-t-[30px]" : "rounded-full"
          }`}
        />
        <TouchableOpacity
          onPress={() => setShowCityDropdown(!showCityDropdown)}
          className="absolute right-5 top-6"
          style={{
            transform: [{ rotate: showCityDropdown ? "180deg" : "0deg" }],
          }}
        >
          <DownIcon />
        </TouchableOpacity>
        {showCityDropdown && cityList.length > 0 && (
          <View className="absolute top-12 left-0 right-0 bg-lightLightGray shadow-md z-10 max-h-60 rounded-b-[30px]">
            <ScrollView>
              {cityList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setCity(item.Description);
                    setShowCityDropdown(false);
                  }}
                  className="px-5"
                >
                  <Text
                    allowFontScaling={false}
                    className="text-base py-5 border-b border-white"
                  >
                    {item.Description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Вибір відділення (для самовивозу) */}
      {branchList.length > 0 && (
        <View className="relative mt-4">
          <TextInput
            placeholder="Оберіть відділення або поштомат"
            value={branch}
            onChangeText={setBranch}
            className={`bg-lightLightGray p-5 pr-12 mb-2 flex-row items-center ${
              showBranchDropdown ? "rounded-t-[30px]" : "rounded-full"
            }`}
          />
          <TouchableOpacity
            onPress={() => setShowBranchDropdown(!showBranchDropdown)}
            className="absolute right-5 top-6"
            style={{
              transform: [{ rotate: showBranchDropdown ? "180deg" : "0deg" }],
            }}
          >
            <DownIcon />
          </TouchableOpacity>
          {showBranchDropdown && branchList.length > 0 && (
            <View className="absolute top-12 left-0 right-0 bg-lightLightGray shadow-md z-10 max-h-60 rounded-b-[30px]">
              <ScrollView>
                {branchList
                  .filter((b) =>
                    b.Description.toLowerCase().includes(branch.toLowerCase())
                  )
                  .map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setBranch(item.Description);
                        setShowBranchDropdown(false);
                      }}
                      className="px-5"
                    >
                      <Text
                        allowFontScaling={false}
                        className="text-base py-5 border-b border-white"
                      >
                        {item.Description}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* Вибір адреси (для кур'єрської доставки) */}
      {branchList.length === 0 && (
        <>
          <View className="relative mt-4">
            <TextInput
              placeholder="Введіть назву вулиці"
              value={street}
              onChangeText={(text) => {
                setStreet(text);
                fetchStreets(text);
              }}
              className={`bg-lightLightGray p-5 pr-12 mb-2 flex-row items-center ${
                showStreetDropdown ? "rounded-t-[30px]" : "rounded-full"
              }`}
            />
            <TouchableOpacity
              onPress={() => setShowStreetDropdown(!showStreetDropdown)}
              className="absolute right-5 top-6"
              style={{
                transform: [{ rotate: showStreetDropdown ? "180deg" : "0deg" }],
              }}
            >
              <DownIcon />
            </TouchableOpacity>
            {showStreetDropdown && streetList.length > 0 && (
              <View className="absolute top-12 left-0 right-0 bg-lightLightGray shadow-md z-10 max-h-60 rounded-b-[30px]">
                <ScrollView>
                  {streetList.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setStreet(item.Description);
                        setShowStreetDropdown(false);
                      }}
                      className="px-5"
                    >
                      <Text
                        allowFontScaling={false}
                        className="text-base py-5 border-b border-white"
                      >
                        {item.Description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View className="flex-row gap-2">
            <View className="relative flex-1">
              <TextInput
                placeholder="Номер будинку"
                value={houseNumber}
                onChangeText={setHouseNumber}
                className="bg-lightLightGray p-5 rounded-full mb-2 flex-row items-center"
              />
            </View>
            <View className="relative flex-1">
              <TextInput
                placeholder="Квартира / Офіс"
                value={apartment}
                onChangeText={setApartment}
                className="bg-lightLightGray p-5 rounded-full mb-2 flex-row items-center"
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};
