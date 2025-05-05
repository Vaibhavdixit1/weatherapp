"use client";
import React, { useEffect } from "react";
import { MdOutlineLocationOn, MdMyLocation } from "react-icons/md";
import { FaSun, FaMoon } from "react-icons/fa";
import SearchBox from "./SearchBox";
import { useState } from "react";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const { theme, setTheme } = useTheme();
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  useEffect(() => {
    if (city.trim() === "") {
      handleCurrentLocation();
    }
  }, [city]);
  async function handleInputChang(value: string) {
    setCity(value);
    const zipWithCountryPattern = /^\d{3,10},[a-zA-Z]{2}$/; // e.g., 90210,us

    if (value.length >= 3) {
      try {
        let suggestionsData: string[] = [];

        if (zipWithCountryPattern.test(value.trim())) {
          // ZIP+CountryCode format (e.g., 90210,us)
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?zip=${value.trim()}&appid=${API_KEY}`
          );
          if (response.data && response.data.name) {
            suggestionsData = [response.data.name];
          }
        } else {
          // City name search
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
          );
          suggestionsData = response.data.list.map((item: any) => item.name);
        }

        setSuggestions(suggestionsData);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
        setError(
          "Location not found or check the ZIP code + country format (e.g., 90210,us)"
        );
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmiSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a location");
      return;
    }

    if (suggestions.length === 0) {
      setError("Location not found");
      setLoadingCity(false);
    } else {
      setLoadingCity(true);
      setError("");
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 shadow-md bg-white dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Weather<span className="text-red-400">-TeachEdison</span>
          </h1>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-2xl text-gray-700 dark:text-white hover:hover:text-red-400 transition duration-300"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            {/* Current Location Button */}
            <MdMyLocation
              title="Your Current Location"
              onClick={handleCurrentLocation}
              className="text-2xl cursor-pointer hover:text-red-400 transition duration-300"
            />

            {/* Static Location Icon */}
            <MdOutlineLocationOn className="text-2xl text-red-400" />

            {/* Location Display */}
            <p className="text-sm font-medium text-gray-700 dark:text-white">
              {location}
            </p>

            <div className="relative hidden md:block">
              {/* Search Box */}
              <SearchBox
                value={city}
                onSubmit={handleSubmiSearch}
                onChange={(e) => handleInputChang(e.target.value)}
              />
              {/* Suggestion Box */}
              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error,
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile View */}
      <div className="block md:hidden px-4 mt-2">
        <div className="relative">
          <SearchBox
            value={city}
            onSubmit={handleSubmiSearch}
            onChange={(e) => handleInputChang(e.target.value)}
          />
          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error,
            }}
          />
        </div>
      </div>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="absolute z-10 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 rounded-md shadow-md min-w-[200px] w-full py-2">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 px-3 py-1 text-sm">{error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-100 transition rounded"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
