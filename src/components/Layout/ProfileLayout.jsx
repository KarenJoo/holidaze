import React from 'react';
import { Avatar, Typography, Grid } from '@mui/material';
import styles from './ProfileLayout.module.css';

const ProfileLayout = ({ userData }) => {
  const { name, avatar, bookedVenues, venueManager, venues } = userData;
  const venuesCount = venues ? venues.length : 0;

  return (
    <div className={styles.profileContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          {avatar && (
            <Avatar
              alt={name || 'User Avatar'}
              src={avatar.url}
              sx={{ width: 120, height: 120 }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant='h2'>{name || 'Unknown User'}</Typography>
          <Typography variant='body1'>
            Venue Manager: {venueManager ? 'Yes' : 'No'}
          </Typography>
          <Typography variant='body1'>Total Venues: {venuesCount}</Typography>
        </Grid>
      </Grid>

      {!venueManager && (
        <Grid item xs={12} md={9}>
          <Typography variant='h2'>Bookings</Typography>
          <Typography variant='body1'>
            Total Bookings: {bookedVenues ? bookedVenues.length : 0}
          </Typography>
          <Typography variant='h2'>Booked Venues</Typography>
          <ul>
            {bookedVenues &&
              bookedVenues.map((venue) => (
                <li key={venue.id}>
                  <Typography variant='body1'>{venue.name}</Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Location: {venue.location.city}, {venue.location.country}
                  </Typography>
                </li>
              ))}
          </ul>
        </Grid>
      )}
    </div>
  );
};

export default ProfileLayout;
