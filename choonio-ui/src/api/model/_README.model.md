# README API Model

This API model is the client side implementation of the backend API model.

It contains definitions for all data structures passed to/from the backend API.

The arrangement of the client side model definitions is analagous to the package structure in the backend API.

For each backend API package there is a correspondingly named source file here, and that source file will contain corresponding definitions for classes in that backend API package.

For example, given a backend API package named "albums" with "AlbumData" and "AlbumTrackData" classes, there will be a corresponding source file here named "albums-model.tsx" and that source file wille export definitions for "AlbumData" and "AlbumTrackData" models.

Artefacts exist here for every API class, whether they are currently used by the frontend or not.
