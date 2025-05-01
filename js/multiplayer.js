// js/multiplayer.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const URL = 'https://yocxtkgrsvtofxwdqwpp.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvY3h0a2dyc3Z0b2Z4d2Rxd3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Njc5OTksImV4cCI6MjA2MTM0Mzk5OX0.NV67TZWZVIYwp4QCFFua5Gchs_GatngOQWqpa1Pq6X4';
export const supabase = createClient(URL, KEY);

let subscription = null;

// 1) Create or fetch the game row
export async function initRoom(roomCode) {
  // try to fetch
  let { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('room_code', roomCode)
    .single();

  if (error) {
    // no room yet → create it
    const init = {
      room_code: roomCode,
      board: JSON.stringify(Array(9).fill('')),
      turn: 'X',
      winner: null
    };
    ({ data } = await supabase.from('games').insert(init).single());
  }

  return data;
}

// 2) Subscribe to updates
export function subscribeRoom(roomCode, onUpdate) {
  subscription = supabase
    .from(`games:room_code=eq.${roomCode}`)
    .on('UPDATE', payload => {
      onUpdate(payload.new);
    })
    .subscribe();
}

// 3) Push local move to Supabase
export async function pushMove(roomCode, boardArr, nextTurn, winner = null) {
  await supabase
    .from('games')
    .update({
      board: JSON.stringify(boardArr),
      turn: nextTurn,
      winner
    })
    .eq('room_code', roomCode);
}

// 4) Cleanup
export async function leaveRoom() {
  if (subscription) {
    await supabase.removeSubscription(subscription);
    subscription = null;
  }
}