using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UniTransport.DAL.Entities;

namespace UniTransport.DAL.Database
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<Student> Students { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<RequestedTrip> RequestedTrips { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<User> Users { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Vehicle)
                .WithMany(v => v.Trips)
                .HasForeignKey(t => t.VehicleId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.RequestedTrip)
                .WithOne()
                .HasForeignKey<Trip>(t => t.RequestedTripId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Trip>()
                .HasMany(t => t.Bookings)
                .WithOne(b => b.Trip)
                .HasForeignKey(b => b.TripId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
