const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        // done
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // done
        longURL: {
            type: String,
            required: true,
            trim: true,
        },

        // done
        shortURL: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        // done
        visitedIP: [
        ],


        clicks: {

            // done
            total: {
                type: Number,
                default: 0,
            },
            // done
            unique: {
                type: Number,
                default: 0,
            },
        },
        analytics: {

            // done
            devices: {
                mobile: { type: Number, default: 0 },
                desktop: { type: Number, default: 0 },
                tablet: { type: Number, default: 0 },
            },

            // done
            browsers: {
                chrome: { type: Number, default: 0 },
                safari: { type: Number, default: 0 },
                firefox: { type: Number, default: 0 },
                edge: { type: Number, default: 0 },
                other: { type: Number, default: 0 },
            },

            // done
            geography: [
                {
                    country: String,
                    clicks: { type: Number, default: 0 },
                },
            ],

            // done
            hourlyClicks: [
                {
                    hour: { type: Number, required: true },
                    clicks: { type: Number, default: 0 },
                },
            ],


            dailyClicks: [
                {
                    // done
                    date: { type: String, required: true },

                    // done
                    totalClicks: { type: Number, default: 0 },

                    // done 
                    uniqueClicks: { type: Number, default: 0 },
                },
            ],
        },

        // done
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);


urlSchema.pre("save", function (next) {
    if (this.isNew) {
        this.analytics.hourlyClicks = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            clicks: 0
        }));
    }
    next();
});


urlSchema.pre("save", function (next) {
    if (this.analytics.dailyClicks.length > 30) {
        this.analytics.dailyClicks = this.analytics.dailyClicks.slice(-30);
    }
    next();
});

module.exports = mongoose.model("URL", urlSchema);